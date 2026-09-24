"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { serverGetWithBareGet } from "@/app/server_request/server_services";

export default function PaidWithdrawalsPage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const { admin, token } = useAdmin();

  type completeWithdrawal = {
    id: number;
    user_id: number;
    usdt_amount: string;
    wallet_address: string;
    fely_amount: string;
    withdrawal_date: string;
    transaction_hash: string;
    status: string;
  };

  const [completeWithdrawal, setCompleteWithdrawal] = useState<completeWithdrawal[]>([]);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  useEffect(() => {
    if (token) getCompleteWithdrawals(token);
  }, [token]);

  const getCompleteWithdrawals = async (Bearer: any) => {
    try {
      const response = await serverGetWithBareGet(
        "",
        "/admin/withdrawals?status=completed&sort_by=created_at&sort_order=desc",
        Bearer
      );
      const data = response.data.withdrawals;
      setCompleteWithdrawal(
        data.map((item: any) => ({
          id: item.id,
          user_id: item.user.id,
          wallet_address: item.user.wallet_address,
          usdt_amount: item.amounts.usdt_amount,
          fely_amount: item.amounts.fely_amount,
          withdrawal_date: item.dates.withdrawal_date,
          transaction_hash: item.transaction.hash,
          status: item.status.text,
        }))
      );
    } catch (error) {
      console.error("Error fetching paid withdrawals:", error);
    }
  };

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
          <span className="text-blue-600 font-semibold">Paid Withdrawals</span>
        </nav>
      </div>

      {/* ── Summary Bar ── */}
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="ml-auto flex items-center">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] text-emerald-700 font-semibold border border-emerald-200">
            {completeWithdrawal.length} completed
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-gray-600">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">User ID</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">USDT Amount</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">FELY Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Wallet Address</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Transaction Hash</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Withdrawal Date</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {completeWithdrawal.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-medium">No paid withdrawals found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                completeWithdrawal.map((row, i) => {
                  const walletShort = row.wallet_address
                    ? `${row.wallet_address.substring(0, 8)}...${row.wallet_address.substring(row.wallet_address.length - 6)}`
                    : "N/A";
                  const txShort = row.transaction_hash
                    ? `${row.transaction_hash.substring(0, 10)}...${row.transaction_hash.substring(row.transaction_hash.length - 8)}`
                    : "N/A";

                  return (
                    <tr key={i} className="hover:bg-emerald-50/30 transition-colors duration-100 group">
                      {/* User ID */}
                      <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-800">
                        #{row.user_id}
                      </td>
                      {/* USDT */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700 border border-green-200">
                          {row.usdt_amount} USDT
                        </span>
                      </td>
                      {/* FELY */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700 border border-violet-200">
                          {row.fely_amount} FELY
                        </span>
                      </td>
                      {/* Wallet */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-gray-600">{walletShort}</span>
                          <button
                            onClick={() => copyToClipboard(row.wallet_address)}
                            className="rounded px-1.5 py-0.5 text-[9px] font-semibold border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
                          >
                            {copiedHash === row.wallet_address ? "✓" : "Copy"}
                          </button>
                        </div>
                      </td>
                      {/* Txn Hash */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-gray-600">{txShort}</span>
                          <button
                            onClick={() => copyToClipboard(row.transaction_hash)}
                            className="rounded px-1.5 py-0.5 text-[9px] font-semibold border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
                          >
                            {copiedHash === row.transaction_hash ? "✓" : "Copy"}
                          </button>
                        </div>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{new Date(row.withdrawal_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</div>
                        <div className="text-[10px] text-gray-400">{new Date(row.withdrawal_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
