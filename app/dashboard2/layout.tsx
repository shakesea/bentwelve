// app/dashboard2/layout.tsx
import SideBar from "../ui/dashboard/nav-links";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <div className="flex h-screen flex-col md:flex-row overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideBar />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
