// app/lib/authOptions.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

const sql = postgres(process.env.DATABASE_URL || "");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("No credentials provided");
          return null;
        }

        try {
          const result = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
          const user = result[0];
          console.log("User from DB:", user);

          if (!user) {
            console.log("User not found for email:", credentials.email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log("Provided password:", credentials.password, "Is valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Invalid password for email:", credentials.email);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Database error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      console.log("JWT Callback - Token:", token, "User:", user);
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      console.log("Session Callback - Session:", session, "Token:", token);
      if (session.user) {
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.id = token.id;
      }
      return session;
    },
  },
};