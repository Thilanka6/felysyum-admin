"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  isOpen,
  isCollapsed,
  setIsCollapsed,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isStakeFelyOpen, setIsStakeFelyOpen] = useState(false);
  const [isWithdrawalsOpen, setIsWithdrawalsOpen] = useState(false);

  // Auto-expand submenu if active
  useEffect(() => {
    if (
      pathname.includes("/approve-spending") ||
      pathname.includes("/approved-spending") ||
      pathname.includes("/completed-withdrawal")
    ) {
      setIsStakeFelyOpen(true);
    }
    if (
      pathname.includes("/pending-withdrawals") ||
      pathname.includes("/paid-withdrawals")
    ) {
      setIsWithdrawalsOpen(true);
    }
  }, [pathname]);

  const isActive = (path: string) => pathname === path;
  const isStakeFelyActive =
    pathname.includes("/approve-spending") ||
    pathname.includes("/approved-spending") ||
    pathname.includes("/completed-withdrawal");
  const isWithdrawalsActive =
    pathname.includes("/pending-withdrawals") ||
    pathname.includes("/paid-withdrawals");

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onCloseMobile}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 overflow-y-auto border-r border-gray-800 bg-dark-900 transition-all duration-300 ease-in-out md:static md:inset-auto md:block flex-shrink-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "md:w-20" : "md:w-64"} w-64`}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
          {/* Large Logo */}
          <img
            src="/assets/images/mat-logo.png"
            alt="Feliciamatrix"
            className={`h-8 w-auto transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}
          />
          {/* Small Logo */}
          <img
            src="/assets/images/mat-logo-s.png"
            alt="Felysyum"
            className={`h-8 w-8 transition-all duration-300 ${isCollapsed ? "block" : "hidden"}`}
          />
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {/* Main Section */}
          <div
            className={`px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 transition-opacity duration-300 ${isCollapsed ? "hidden" : "block"}`}
          >
            Main
          </div>

          <Link
            href="/"
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${isActive("/") ? "bg-primary text-white shadow-md" : "text-gray-300 hover:bg-dark-800 hover:text-white"}`}
            title="Dashboard"
          >
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span
              className={`whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}
            >
              Dashboard
            </span>
          </Link>

          {/* Stake FELY Dropdown */}
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              setIsStakeFelyOpen(!isStakeFelyOpen);
            }}
            className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${isStakeFelyActive ? "text-white bg-dark-800" : "text-gray-300 hover:bg-dark-800 hover:text-white"}`}
            title="Stake FELY"
          >
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span
                className={`whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}
              >
                Stake FELY
              </span>
            </div>
            <svg
              className={`h-4 w-4 bg-transparent transition-transform duration-200 ${isStakeFelyOpen ? "rotate-180" : ""} ${isCollapsed ? "hidden" : "block"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`space-y-1 pl-11 ${isStakeFelyOpen ? "block" : "hidden"} ${isCollapsed ? "hidden" : "block"}`}
          >
            <Link
              href="/approve-spending"
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive("/approve-spending") ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Pending Approvals
            </Link>
            <Link
              href="/approved-spending"
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive("/approved-spending") ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Approved List
            </Link>
            <Link
              href="/completed-withdrawal"
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive("/completed-withdrawal") ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Completed Withdrawal
            </Link>
          </div>

          {/* Withdrawals Dropdown */}
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              setIsWithdrawalsOpen(!isWithdrawalsOpen);
            }}
            className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${isWithdrawalsActive ? "text-white bg-dark-800" : "text-gray-300 hover:bg-dark-800 hover:text-white"}`}
            title="Withdrawals"
          >
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span
                className={`whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}
              >
                Withdrawals
              </span>
            </div>
            <svg
              className={`h-4 w-4 bg-transparent transition-transform duration-200 ${isWithdrawalsOpen ? "rotate-180" : ""} ${isCollapsed ? "hidden" : "block"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`space-y-1 pl-11 ${isWithdrawalsOpen ? "block" : "hidden"} ${isCollapsed ? "hidden" : "block"}`}
          >
            <Link
              href="/pending-withdrawals"
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive("/pending-withdrawals") ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Pending Withdrawals
            </Link>
            <Link
              href="/paid-withdrawals"
              className={`block rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive("/paid-withdrawals") ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Paid Withdrawals
            </Link>
          </div>

          {/* System Section */}
          <div
            className={`px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-2 transition-opacity duration-300 ${isCollapsed ? "hidden" : "block"}`}
          >
            System
          </div>

          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${isActive("/settings") ? "bg-primary text-white shadow-md" : "text-gray-300 hover:bg-dark-800 hover:text-white"}`}
            title="Settings"
          >
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span
              className={`whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}
            >
              Settings
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-dark-800 hover:text-red-300 transition-all mt-4"
            title="Logout"
          >
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span
              className={`whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}
            >
              Logout
            </span>
          </button>
        </nav>
      </aside>
    </>
  );
}
