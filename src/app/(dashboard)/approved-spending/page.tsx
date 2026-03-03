"use client";
import { serverGetWithBareGet } from "@/app/server_request/server_services";
import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";

export default function ApprovedSpendingPage() {
  const { admin, token } = useAdmin();

  type pendingWithdrawal = {
    id: number;
    user_id: number;
    wallet_address: string;
    transaction_hash: string;
    month: number;
    usdt_amount: string;
    fely_amount: string;
    fely_bonus_amount: string;
    status: string;
  };

  const [pendingWithdrawal, setPendingWithdrawal] = useState<
    pendingWithdrawal[]
  >([]);

  useEffect(() => {
    if (token) {
      getCompleteWithdrawals(token);
    }
  }, [token]);

  const getCompleteWithdrawals = async (Bearer: any) => {
    try {
      const obj = {
        status: "active",
      };
      const MyStakingData = await serverGetWithBareGet(
        obj,
        "/admin/stakings",
        Bearer,
      );
      console.log(MyStakingData);

      const data = MyStakingData.data.stakings;

      setPendingWithdrawal(
        data.map((item: any) => ({
          id: item.id,
          user_id: item.user.id,
          wallet_address: item.wallet_address,
          usdt_amount: item.amounts.usdt_amount,
          fely_amount: item.amounts.fely_amount,
          fely_bonus_amount: item.amounts.fely_bonus_amount, // fixed: was item.amount.fely_bonus_amount
          month: item.staking_info.month,
          transaction_hash: item.transaction_hash,
          status: item.status.display,
        })),
      );
    } catch (error) {
      console.error("Error fetching stakings:", error);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-sm font-bold text-gray-900 md:text-base">
            Stake FELY Approved List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  FX Code
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  Capital
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  Interest
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  Wallet Address
                </th>
                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">
                  Date
                </th>
                <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingWithdrawal.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">
                    {row.user_id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">
                    {row.wallet_address}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">
                    {row.transaction_hash}
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                    {row.month}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">
                    {row.usdt_amount}
                  </td>
                  <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">
                    {row.fely_amount}
                  </th>
                  <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">
                    {row.fely_bonus_amount}
                  </th>
                  <td className="px-4 py-2 text-center whitespace-nowrap md:px-6 md:py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm hover:bg-emerald-600 transition-all uppercase tracking-wide">
                        {row.status}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
