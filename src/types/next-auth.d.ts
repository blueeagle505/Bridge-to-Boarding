import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "APPLICANT" | "MENTOR" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "APPLICANT" | "MENTOR" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "APPLICANT" | "MENTOR" | "ADMIN";
  }
}
