// Access-token endpoint (App Router). Mirrors the implementation.md
// /pages/api/token.ts contract.
//
// Stub mode: there is no JWT, so we return the dev username. The axios
// interceptor turns `devUser` into the `x-dev-user` header that the Express
// stub auth middleware reads. When real Auth0 is wired, this returns a real
// `accessToken` and the interceptor sends it as a Bearer token instead —
// no client changes needed.
//
// Not authenticated → 200 with nulls (public browsing is allowed; the
// interceptor simply attaches nothing).

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = (await cookies()).get("tb_dev_user")?.value ?? null;

  return NextResponse.json({
    accessToken: user ? `stub-token:${user}` : null,
    devUser: user,
  });
}
