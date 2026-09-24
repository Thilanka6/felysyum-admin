"use client";

import { useState, useEffect } from "react";
import { serverGetWithBareGet } from "@/app/server_request/server_services";
import { useAdmin } from "@/hooks/useAdmin";

export default function OlympusPaidWithdrawalsPage() {
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [txnFilter, setTxnFilter] = useState("");

  const fetchWithdrawals = async () => {
    if (!token) return;
    try {
      let url = `/admin/divine-withdrawals?page=${page}&per_page=${perPage}&status=approved`;
      if (fromDate) url += `&from_date=${fromDate}`;
      if (toDate) url += `&to_date=${toDate}`;
      if (txnFilter) url += `&transaction_hash=${txnFilter}`;
      const response = await serverGetWithBareGet("", url, token);
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
  }, [token, page]);

  const totalItems = pagination?.total ?? data.length;
  const currentPage = pagination?.current_page ?? page;
  const lastPage = pagination?.last_page ?? 1;

  return (
    <div className="w-full space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-800">Paid Withdrawals</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">View all completed withdrawal transactions</p>
        </div>
        <nav className="flex items-center gap-1 text-[11px] text-gray-400">
          <span>Pages</span>
          <span className="text-gray-300">/</span>
          <span>Olympus</span>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-semibold">Paid Withdrawals</span>
        </nav>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        {/* From Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        {/* To Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        {/* Txn Hash */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Txn Hash</label>
          <input
            type="text"
            placeholder="Search by 0x..."
            value={txnFilter}
            onChange={(e) => setTxnFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWithdrawals()}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 font-mono focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button
          onClick={() => { setPage(1); fetchWithdrawals(); }}
          className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          Search
        </button>
        <button
          onClick={() => { setFromDate(""); setToDate(""); setTxnFilter(""); setPage(1); }}
          className="rounded-md border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <div className="ml-auto flex items-center">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] text-emerald-700 font-semibold border border-emerald-200">
            {totalItems} paid
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
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Txn Hash</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-medium">No paid withdrawals found</span>
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
                  const txnHash = row.transaction_hash || "N/A";
                  const walletShort = wallet !== "N/A" ? `${wallet.substring(0, 8)}...${wallet.substring(wallet.length - 6)}` : "N/A";
                  const txnShort = txnHash !== "N/A" ? `${txnHash.substring(0, 10)}...${txnHash.substring(txnHash.length - 8)}` : "N/A";

                  return (
                    <tr key={i} className="hover:bg-emerald-50/30 transition-colors duration-100 group">
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
                      {/* Txn Hash */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {txnHash !== "N/A" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-gray-600">{txnShort}</span>
                            <button
                              onClick={() => copyToClipboard(txnHash)}
                              className="transition-opacity rounded px-1.5 py-0.5 text-[9px] font-semibold border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300"
                            >
                              {copiedHash === txnHash ? "✓" : "Copy"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Paid
                        </span>
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
