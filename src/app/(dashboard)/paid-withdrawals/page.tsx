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

  const [completeWithdrawal, setCompleteWithdrawal] = useState<
    completeWithdrawal[]
  >([]);

  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const copyToClipboard = (hash: string, id: string | number) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (token) {
      getCompleteWithdrawals(token);
    }
  }, [token]);

  const getCompleteWithdrawals = async (Bearer: any) => {
    try {
      const response = await serverGetWithBareGet(
        "",
        "/admin/withdrawals?status=completed&sort_by=created_at&sort_order=desc",
        Bearer,
      );
      const data = response.data.withdrawals; // or your API response array

      setCompleteWithdrawal(
        data.map((item: any) => ({
          id: item.id,
          user_id: item.user.id,
          wallet_address: item.user.wallet_address,
          usdt_amount: item.amounts.usdt_amount,
          fely_amount: item.amounts.fely_amount,
          withdrawal_date: item.dates.withdrawal_date,
          transaction_hash: item.dates.wallet_address,
          status: item.status.text,
        })),
      );

      console.log(response);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-gray-900">
          Paid Withdrawals
        </h1>
        {/* Breadcrumbs could go here if needed */}
        <span className="text-xs text-gray-500">
          Pages {">"} Paid Withdrawals
        </span>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6 items-end">
          {/* FX Code */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-900 md:text-sm">
              Code
            </label>
            <input
              type="text"
              placeholder="Enter Code"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          {/* From Date */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-900 md:text-sm">
              From Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-900 md:text-sm">
              To Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#E49127] px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-[#CF7D1C]">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              SEARCH
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              title="Reset"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-sm font-bold text-gray-900 md:text-base">
            Paid Withdrawals
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  user id
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3 text-right">
                  usdt amount
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  fely amount
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  wallet address
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  Transaction hash
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  withdrawal date
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {completeWithdrawal.map((row, i) => (
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">
                    {row.user_id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">
                    {row.usdt_amount}
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                    {row.fely_amount}
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                    {row.wallet_address}
                  </td>
                  <td className="px-4 py-2 text-gray-500 md:px-6 md:py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="block truncate max-w-[200px]"
                        title={row.wallet_address}
                      >
                        {row.wallet_address}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(row.wallet_address, row.id);
                        }}
                        className="text-gray-400 hover:text-brand transition-colors"
                        title="Copy Hash"
                      >
                        {copiedHash === row.wallet_address ? (
                          <svg
                            className="h-4 w-4 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-500 md:px-6 md:py-3">
                    {new Date(row.withdrawal_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap md:px-6 md:py-3">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
