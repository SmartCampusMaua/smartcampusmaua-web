"use client";

import { useState } from "react";
import Header from "@/app/ui/dashboard/header";
import Sidenav from "@/app/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <Header toggleSidebar={toggleSidebar} />

      <div className={`transition-transform duration-800 ${isSidebarOpen ? "w-64" : "w-0"}`}>
        <Sidenav isOpen={isSidebarOpen} />
      </div>

      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 py-8">{children}</div>
    </div>
  );
}