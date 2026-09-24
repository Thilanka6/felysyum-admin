"use client";

import { useState } from 'react';

export default function CompletedWithdrawalPage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Static demo rows (original data preserved)
  const rows = [
    { code: "FX14969", capital: "2,845.00", interest: "426.75", wallet: "0xE7B7F3F1e9DEd4AF06DedFbB5180c06433259631", hash: "0xd1bbea6fffd6357967e0c74dd51698230acb3c736889623e0c1decb1...", date: "2026-02-23" },
    { code: "15665",   capital: "1,437.00", interest: "143.70", wallet: "0xdb7cf5A0a958fbcd5705D0640ed4a438241cF604", hash: "0x078edc3c2b65d67e7b1a2792eee866ea69aa21ba2009806de8956679...", date: "2026-02-23" },
    { code: "FX15660", capital: "1,437.00", interest: "143.70", wallet: "0xb8400ae6F4044c2e45F17bf7EE0831CB587Fb00c", hash: "0x5b7b016a77de9fd1e908796ffd5f46aa609a57da04335bdc7ed9c25b...", date: "2026-02-23" },
    { code: "FX15656", capital: "1,437.00", interest: "143.70", wallet: "0x368190D81e7F176D499E571B281e1B69Fdf3583e", hash: "0xb5eae2bd552999f3dce78ed7a9d9a1389c5518afcc02df0fa6afdcc0...", date: "2026-02-23" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-800">Completed Withdrawals</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Completed Stake FELY withdrawal records</p>
        </div>
        <nav className="flex items-center gap-1 text-[11px] text-gray-400">
          <span>Pages</span>
          <span className="text-gray-300">/</span>
          <span>Stake FELY</span>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-semibold">Completed Withdrawal</span>
        </nav>
      </div>

      {/* ── Summary Bar ── */}
      <div className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="ml-auto">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] text-emerald-700 font-semibold border border-emerald-200">
            {rows.length} completed
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-gray-600">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Code</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Capital</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Interest</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Wallet Address</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Transaction Hash</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, i) => {
                const walletShort = `${row.wallet.substring(0, 8)}...${row.wallet.substring(row.wallet.length - 6)}`;
                const hashShort = row.hash.length > 20 ? `${row.hash.substring(0, 12)}...` : row.hash;
                return (
                  <tr key={i} className="hover:bg-emerald-50/30 transition-colors duration-100 group">
                    <td className="px-4 py-2.5 whitespace-nowrap font-medium text-gray-800">{row.code}</td>
                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">{row.capital}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 border border-violet-200">{row.interest}</span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-gray-600">{walletShort}</span>
                        <button onClick={() => copyToClipboard(row.wallet)} className="rounded px-1.5 py-0.5 text-[9px] font-semibold border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors">
                          {copiedHash === row.wallet ? "✓" : "Copy"}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-gray-600">{hashShort}</span>
                        <button onClick={() => copyToClipboard(row.hash)} className="rounded px-1.5 py-0.5 text-[9px] font-semibold border border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors">
                          {copiedHash === row.hash ? "✓" : "Copy"}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-gray-600">{row.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
