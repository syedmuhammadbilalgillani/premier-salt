import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    firstName: string;
    lastName: string | null;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string | null;
  }
}
