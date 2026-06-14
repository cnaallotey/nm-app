import type { Profile } from "@prisma/client";

// express-oauth2-jwt-bearer augments Request with `auth`; we add `profile`
// (resolved by attachProfile) so downstream handlers are fully typed.
declare global {
  namespace Express {
    interface Request {
      profile?: Profile;
      auth?: {
        payload: {
          sub?: string;
          [key: string]: unknown;
        };
      };
    }
  }
}

export {};
