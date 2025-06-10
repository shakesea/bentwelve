import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";

// Pastikan path ini sesuai
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Extend the Session type to include 'role'
type SessionWithRole = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
};

export async function middleware(req: NextRequest) {
  try {
    console.log("Middleware started for:", req.url); // Log awal
    const session = (await getServerSession(authOptions)) as SessionWithRole | null;

    console.log("Middleware Session:", session); // Log sesi

    if (!session || !session.user) {
      console.log("No session or user, redirecting to /");
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!session.user.role || session.user.role !== "admin") {
      console.log("Role is invalid or not admin:", session.user.role, "redirecting to /");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("Access granted to /dashboard2 with role:", session.user.role);
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", req.url)); // Redirect jika error
  }
}

export const config = {
  matcher: ["/dashboard2/:path*"],
};