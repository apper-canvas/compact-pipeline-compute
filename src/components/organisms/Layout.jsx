import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-slate-100">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0 p-6">
          <div className="sticky top-6">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ toggleMobileSidebar }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;