"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { serverGetWithBareGet } from "@/app/server_request/server_services";
import Link from "next/link";

export default function DashboardPage() {
  const { token } = useAdmin();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [paidCount, setPaidCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        const [pend, paid] = await Promise.allSettled([
          serverGetWithBareGet("", "/admin/divine-withdrawals?page=1&per_page=1000&status=pending", token),
          serverGetWithBareGet("", "/admin/divine-withdrawals?page=1&per_page=1000&status=approved", token),
        ]);

        if (pend.status === "fulfilled") {
          const d = pend.value;
          const list = d?.data?.withdrawals ?? d?.withdrawals ?? [];
          setPendingCount(d?.data?.pagination?.total ?? d?.pagination?.total ?? list.length);
        } else {
          setPendingCount(0);
        }

        if (paid.status === "fulfilled") {
          const d = paid.value;
          const list = d?.data?.withdrawals ?? d?.withdrawals ?? [];
          setPaidCount(d?.data?.pagination?.total ?? d?.pagination?.total ?? list.length);
        } else {
          setPaidCount(0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  return (
    <div className="w-full space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-800">Dashboard</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Olympus withdrawal overview</p>
        </div>
        <nav className="flex items-center gap-1 text-[11px] text-gray-400">
          <span className="text-blue-600 font-semibold">Dashboard</span>
        </nav>
      </div>

      {/* ── Stats Cards ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Pending */}
        <Link
          href="/olympus/pending-withdrawals"
          className="group flex w-full sm:w-56 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-150"
        >
          <div className="rounded-md bg-amber-50 p-1.5 text-amber-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Pending</p>
            <p className={`text-base font-bold leading-none mt-0.5 ${loading ? "animate-pulse text-gray-200" : "text-gray-800"}`}>
              {loading ? "—" : (pendingCount ?? 0).toLocaleString()}
            </p>
          </div>
          <svg className="h-3.5 w-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Paid */}
        <Link
          href="/olympus/paid-withdrawals"
          className="group flex w-full sm:w-56 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-150"
        >
          <div className="rounded-md bg-emerald-50 p-1.5 text-emerald-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Paid</p>
            <p className={`text-base font-bold leading-none mt-0.5 ${loading ? "animate-pulse text-gray-200" : "text-gray-800"}`}>
              {loading ? "—" : (paidCount ?? 0).toLocaleString()}
            </p>
          </div>
          <svg className="h-3.5 w-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ── Summary Bar ── */}
      <div className="inline-flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[11px] font-medium text-gray-500">
            Total: <span className="font-bold text-gray-800">{loading ? "—" : ((pendingCount ?? 0) + (paidCount ?? 0)).toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
