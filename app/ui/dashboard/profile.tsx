"use client";

import { useSession } from "next-auth/react";

export default function ProfileSummary() {
  const { data: session, status } = useSession();
  console.log("ProfileSummary - Session status:", status, "Session data:", session);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (!session) {
    return <p>Tidak ada sesi</p>;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white text-black rounded-2xl shadow-lg w-64 z-50">
      <img
        src="/Kucing.png"
        alt="User Profile"
        className="w-12 h-12 rounded-full border-4 border-green-500"
      />
      <div className="text-right flex-1">
        <p className="font-semibold text-base">
          Welcome, {session.user?.email?.split("@")[0] || "User"}
        </p>
        <p className="text-sm text-gray-500">{session.user?.email || "No email"}</p>
      </div>
    </div>
  );
}