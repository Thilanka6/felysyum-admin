"use client";

import { useState, useEffect } from "react";
import { serverGetWithBareGet } from "@/app/server_request/server_services";
import { useAdmin } from "@/hooks/useAdmin";

export default function OlympusPendingWithdrawalsPage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const { token } = useAdmin();
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);
  const [search, setSearch] = useState("");
  const [txnHashMap, setTxnHashMap] = useState<Record<number, string>>({});

  const handleTxnHashChange = (id: number, value: string) => {
    setTxnHashMap((prev) => ({ ...prev, [id]: value }));
  };

  const fetchWithdrawals = async () => {
    if (!token) return;
    try {
      const response = await serverGetWithBareGet(
        "",
        `/admin/divine-withdrawals?page=${page}&per_page=${perPage}&status=pending${search ? `&search=${search}` : ""}`,
        token
      );
      if (response?.data?.pagination) {
        setPagination(response.data.pagination);
      } else if (response?.pagination) {
        setPagination(response.pagination);
      }
      if (response?.data?.withdrawals) {
        setData(response.data.withdrawals);
      } else if (response?.withdrawals) {
        setData(response.withdrawals);
      } else if (Array.isArray(response?.data)) {
        setData(response.data);
      } else if (Array.isArray(response)) {
        setData(response);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [token, page, search]);

  const totalItems = pagination?.total ?? data.length;
  const currentPage = pagination?.current_page ?? page;
  const lastPage = pagination?.last_page ?? 1;

  return (
    <div className="w-full space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-800">Pending Withdrawals</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Manage &amp; approve pending withdrawal requests</p>
        </div>
        <nav className="flex items-center gap-1 text-[11px] text-gray-400">
          <span>Pages</span>
          <span className="text-gray-300">/</span>
          <span>Olympus</span>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-semibold">Pending Withdrawals</span>
        </nav>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search user, wallet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWithdrawals()}
            className="w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button
          onClick={fetchWithdrawals}
          className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          Search
        </button>
        <div className="ml-auto flex items-center gap-2 text-[11px] text-gray-500">
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-amber-700 font-semibold border border-amber-200">
            {totalItems} pending
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-gray-600">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">User</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Wallet Address</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Manual Txn Hash</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-medium">No pending withdrawals found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row: any, i: number) => {
                  const date = row.created_at || "N/A";
                  const userEmail = row.user?.email || "";
                  const userId = row.user?.id || row.user_id || "";
                  const wallet = row.wallet_address || row.user?.wallet_address || "N/A";
                  const amount = row.fely_amount || "0.00";
                  const walletShort = wallet !== "N/A" ? `${wallet.substring(0, 8)}...${wallet.substring(wallet.length - 6)}` : "N/A";

                  let statusLabel = "Unknown";
                  let statusClass = "bg-gray-100 text-gray-600";
                  if (row.status === 1 || row.status === "pending") { statusLabel = "Pending"; statusClass = "bg-amber-50 text-amber-700 border border-amber-200"; }
                  else if (row.status === 2 || row.status === "approved") { statusLabel = "Paid"; statusClass = "bg-emerald-50 text-emerald-700 border border-emerald-200"; }
                  else if (row.status === 3 || row.status === "rejected") { statusLabel = "Rejected"; statusClass = "bg-red-50 text-red-700 border border-red-200"; }

                  return (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors duration-100 group">
                      {/* Date */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{new Date(date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</div>
                        <div className="text-[10px] text-gray-400">{new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                      </td>
                      {/* User */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{userEmail || `User #${userId}`}</div>
                      </td>
                      {/* Wallet */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-gray-600">{walletShort}</span>
                          {wallet !== "N/A" && (
                            <button
                              onClick={() => copyToClipboard(wallet)}
                              className="transition-opacity rounded px-1.5 py-0.5 text-[9px] font-semibold border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300"
                            >
                              {copiedHash === wallet ? "✓" : "Copy"}
                            </button>
                          )}
                        </div>
                      </td>
                      {/* Amount */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-700 border border-violet-200">
                          {amount} FELY
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusClass}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          {statusLabel}
                        </span>
                      </td>
                      {/* Txn Hash Input */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <input
                          type="text"
                          placeholder="Enter transaction hash..."
                          value={txnHashMap[row.id] || ""}
                          onChange={(e) => handleTxnHashChange(row.id, e.target.value)}
                          className="w-56 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-800 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                        />
                      </td>
                      {/* Action */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm uppercase tracking-wide">
                          Approve
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-4 py-3">
            <p className="text-[11px] text-gray-500">
              Page <span className="font-semibold text-gray-700">{currentPage}</span> of <span className="font-semibold text-gray-700">{lastPage}</span>
              {pagination?.total && <> &nbsp;·&nbsp; <span className="font-semibold text-gray-700">{pagination.total}</span> total</>}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="px-2 text-[11px] text-gray-400">{currentPage} / {lastPage}</span>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={currentPage === lastPage}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
