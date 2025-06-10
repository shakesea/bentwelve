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
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const result = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
          const user = result[0];
          console.log("User password from DB:", user?.password);

          if (!user) {
            console.log("User not found for email:", credentials.email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            console.log("Invalid password for email:", credentials.email, "Expected hash:", user.password);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
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
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      console.log("Session Callback - Session:", session, "Token:", token);
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };