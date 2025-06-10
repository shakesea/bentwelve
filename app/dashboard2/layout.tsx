"use client"; // Menandai sebagai Client Component

import SideBar from "../ui/dashboard/nav-links";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider>
        <div className="flex h-screen flex-col md:flex-row overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <SideBar />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            {children}
          </div>
        </div>
      </SessionProvider>
    </ThemeProvider>
  );
}