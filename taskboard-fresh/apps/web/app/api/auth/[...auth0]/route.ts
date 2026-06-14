// Stubbed Auth0 universal handler (App Router).
//
// Mirrors the @auth0/nextjs-auth0 routes the rest of the app expects
// (/api/auth/login, /logout, /callback, /me) but, in stub mode, a "login"
// just records a dev username in an httpOnly cookie. Swapping to real Auth0
// later means replacing this file only — callers/useUser stay unchanged.
//
// Served by Next (filesystem route); the next.config `afterFiles` rewrite
// only proxies /api/* paths that have no route handler.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const COOKIE = "tb_dev_user";
const DEV_DEFAULT_USERNAME = process.env.DEV_DEFAULT_USERNAME ?? "alice";

function safeReturnTo(raw: string | null, base: string): URL {
  // Only allow same-origin relative paths to avoid open-redirects.
  const target = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  return new URL(target, base);
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ auth0: string[] }> },
) {
  const { auth0 } = await ctx.params;
  const action = auth0?.[0] ?? "";
  const url = new URL(req.url);

  switch (action) {
    case "login": {
      const user =
        url.searchParams.get("user")?.trim() || DEV_DEFAULT_USERNAME;
      const res = NextResponse.redirect(
        safeReturnTo(url.searchParams.get("returnTo"), req.url),
      );
      res.cookies.set(COOKIE, user, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    case "logout": {
      const res = NextResponse.redirect(
        safeReturnTo(url.searchParams.get("returnTo"), req.url),
      );
      res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
      return res;
    }

    case "callback":
      // No real IdP round-trip in stub mode.
      return NextResponse.redirect(
        safeReturnTo(url.searchParams.get("returnTo"), req.url),
      );

    case "me": {
      const user = (await cookies()).get(COOKIE)?.value;
      if (!user) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 },
        );
      }
      // Shape loosely matches an Auth0 user profile.
      return NextResponse.json({
        sub: `stub|${user}`,
        username: user,
        nickname: user,
      });
    }

    default:
      return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
