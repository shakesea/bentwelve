import SideBar from "../ui/dashboard/nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ProfileSummary is fixed and outside the scrollable container */}

      
      <div className="flex h-screen flex-col md:flex-row overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideBar />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        
      </div>
    </>
  );
}