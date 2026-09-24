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
  const [isOlympusWithdrawalsOpen, setIsOlympusWithdrawalsOpen] = useState(false);

  // Auto-expand submenu if active (olympus check first to avoid conflict)
  useEffect(() => {
    const isOlympusPath =
      pathname.includes("/olympus/pending-withdrawals") ||
      pathname.includes("/olympus/paid-withdrawals");

    if (
      pathname.includes("/approve-spending") ||
      pathname.includes("/approved-spending") ||
      pathname.includes("/completed-withdrawal")
    ) {
      setIsStakeFelyOpen(true);
      setIsWithdrawalsOpen(false);
      setIsOlympusWithdrawalsOpen(false);
    } else if (isOlympusPath) {
      setIsOlympusWithdrawalsOpen(true);
      setIsWithdrawalsOpen(false);
      setIsStakeFelyOpen(false);
    } else if (
      pathname.includes("/pending-withdrawals") ||
      pathname.includes("/paid-withdrawals")
    ) {
      setIsWithdrawalsOpen(true);
      setIsOlympusWithdrawalsOpen(false);
      setIsStakeFelyOpen(false);
    }
  }, [pathname]);

  const isActive = (path: string) => pathname === path;
  const isStakeFelyActive =
    pathname.includes("/approve-spending") ||
    pathname.includes("/approved-spending") ||
    pathname.includes("/completed-withdrawal");
  const isWithdrawalsActive =
    (pathname.includes("/pending-withdrawals") ||
      pathname.includes("/paid-withdrawals")) &&
    !pathname.includes("/olympus/");
  const isOlympusWithdrawalsActive =
    pathname.includes("/olympus/pending-withdrawals") ||
    pathname.includes("/olympus/paid-withdrawals");

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; max-age=0";
    router.push("/login");
  };

  // ── Reusable sub-link ──────────────────────────────────────────────────────
  const SubLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all border border-transparent ${
        isActive(href)
          ? "bg-blue-600/20 text-white border-blue-500/30"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors ${isActive(href) ? "bg-blue-400" : "bg-gray-600 group-hover:bg-blue-400"}`} />
      {label}
    </Link>
  );

  // ── Reusable section label ─────────────────────────────────────────────────
  const SectionLabel = ({ label }: { label: string }) => (
    <div className={`px-3 pt-5 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest transition-opacity duration-300 ${isCollapsed ? "hidden" : "block"}`}>
      {label}
    </div>
  );

  // ── Nav item (link) ────────────────────────────────────────────────────────
  const NavLink = ({
    href,
    icon,
    label,
    active,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
  }) => (
    <Link
      href={href}
      title={label}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${active ?? isActive(href)
        ? "bg-blue-600/20 text-white border border-blue-500/30"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      <span className="flex-shrink-0 h-[18px] w-[18px]">{icon}</span>
      <span className={`whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}>{label}</span>
    </Link>
  );

  // ── Dropdown parent button ─────────────────────────────────────────────────
  const DropdownBtn = ({
    icon,
    label,
    isOpen,
    isGroupActive,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    isOpen: boolean;
    isGroupActive: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${isGroupActive
        ? "bg-blue-600/20 text-white border border-blue-500/30"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 h-[18px] w-[18px]">{icon}</span>
        <span className={`whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}>{label}</span>
      </div>
      <svg
        className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${isCollapsed ? "hidden" : "block"} text-gray-500`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // ── Icons ──────────────────────────────────────────────────────────────────
  const DashboardIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
  const StakeIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
  const WithdrawIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
  const OlympusIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3l14 9-14 9V3z" />
    </svg>
  );
  const SettingsIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  const LogoutIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onCloseMobile}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-white/5 bg-[#0f1117] transition-all duration-300 ease-in-out md:static md:inset-auto md:flex flex-shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "md:w-[68px]" : "md:w-60"} w-60`}
      >
        {/* ── Logo ── */}
        <div className="flex h-14 flex-shrink-0 items-center justify-center border-b border-white/5 px-4">
          <img
            src="/assets/images/mat-logo.png"
            alt="Felysyum"
            className={`h-7 w-auto transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}
          />
          <img
            src="/assets/images/mat-logo-s.png"
            alt="Felysyum"
            className={`h-7 w-7 transition-all duration-300 ${isCollapsed ? "block" : "hidden"}`}
          />
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin">

          {/* Main */}
          <SectionLabel label="Main" />
          <NavLink href="/" icon={DashboardIcon} label="Dashboard" />

          {/* Stake FELY */}
          <SectionLabel label="Stake FELY" />
          <DropdownBtn
            icon={StakeIcon}
            label="Stake FELY"
            isOpen={isStakeFelyOpen}
            isGroupActive={isStakeFelyActive}
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              setIsStakeFelyOpen(!isStakeFelyOpen);
              setIsWithdrawalsOpen(false);
              setIsOlympusWithdrawalsOpen(false);
            }}
          />
          {isStakeFelyOpen && !isCollapsed && (
            <div className="ml-3 pl-3 border-l border-white/8 space-y-0.5 py-1">
              <SubLink href="/approve-spending" label="Pending Approvals" />
              <SubLink href="/approved-spending" label="Approved List" />
              <SubLink href="/completed-withdrawal" label="Completed Withdrawal" />
            </div>
          )}

          {/* Withdrawals */}
          <DropdownBtn
            icon={WithdrawIcon}
            label="Withdrawals"
            isOpen={isWithdrawalsOpen}
            isGroupActive={isWithdrawalsActive}
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              setIsWithdrawalsOpen(!isWithdrawalsOpen);
              setIsStakeFelyOpen(false);
              setIsOlympusWithdrawalsOpen(false);
            }}
          />
          {isWithdrawalsOpen && !isCollapsed && (
            <div className="ml-3 pl-3 border-l border-white/8 space-y-0.5 py-1">
              <SubLink href="/pending-withdrawals" label="Pending Withdrawals" />
              <SubLink href="/paid-withdrawals" label="Paid Withdrawals" />
            </div>
          )}

          {/* Olympus */}
          <SectionLabel label="Olympus" />
          <DropdownBtn
            icon={OlympusIcon}
            label="Withdrawals"
            isOpen={isOlympusWithdrawalsOpen}
            isGroupActive={isOlympusWithdrawalsActive}
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              setIsOlympusWithdrawalsOpen(!isOlympusWithdrawalsOpen);
              setIsStakeFelyOpen(false);
              setIsWithdrawalsOpen(false);
            }}
          />
          {isOlympusWithdrawalsOpen && !isCollapsed && (
            <div className="ml-3 pl-3 border-l border-white/8 space-y-0.5 py-1">
              <SubLink href="/olympus/pending-withdrawals" label="Pending Withdrawals" />
              <SubLink href="/olympus/paid-withdrawals" label="Paid Withdrawals" />
            </div>
          )}

          {/* System */}
          <SectionLabel label="System" />
          <NavLink href="/settings" icon={SettingsIcon} label="Settings" />
        </nav>

        {/* ── Logout ── */}
        <div className="flex-shrink-0 border-t border-white/5 p-3">
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <span className="flex-shrink-0 h-[18px] w-[18px]">{LogoutIcon}</span>
            <span className={`whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
