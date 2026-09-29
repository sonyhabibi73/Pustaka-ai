import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Opt-in via AUTH_DEBUG; leaving it on in dev would print the client secret
  // into the terminal log, which we must never do by default.
  debug: process.env.AUTH_DEBUG === "true",
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database", maxAge: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  providers: [Google],
  trustHost: true,
  pages: { signIn: "/sign-in" },
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
