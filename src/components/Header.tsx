"use client";

import { usePathname } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const admin = useAdmin();

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/approve-spending") return "Approve Spending Cap";
    if (pathname === "/approved-spending") return "Stake FELY Approved List";
    if (pathname === "/settings") return "Settings";
    return "Dashboard";
  };

  const getBreadcrumbs = () => {
    const title = getPageTitle();
    if (title === "Dashboard") return null;
    return `Pages > ${title}`;
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm md:px-6 md:py-4">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="mr-4 text-gray-500 focus:outline-none hover:bg-gray-100 p-2 rounded-md transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-800 md:text-xl">
            {getPageTitle()}
          </h1>
          {getBreadcrumbs() && (
            <p className="text-xs text-gray-500 md:text-sm">
              {getBreadcrumbs()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 focus:outline-none">
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        <div className="relative flex items-center gap-2">
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold overflow-hidden md:h-10 md:w-10">
            AD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{admin?.name}</p>
            <p className="text-xs text-gray-500">{admin?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
