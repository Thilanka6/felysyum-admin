"use client";

import { useState } from 'react';

export default function ApproveSpendingPage() {
    const [isConnected, setIsConnected] = useState(false);

    const connectWallet = () => {
        setIsConnected(true);
    };

    return (
        <>
            {/* Wallet Connection Section */}
            <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 md:mb-8 md:p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-2 md:text-base">Wallet Connection & Spending Cap</h2>
                <p className="text-xs text-gray-500 mb-4 md:text-sm">Connect your wallet to oversee and approve spending caps.</p>

                {/* Wallet Controls */}
                <div>
                    <button
                        onClick={connectWallet}
                        className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primaryHover transition-all shadow-md md:text-sm md:px-4 md:py-2"
                    >
                        <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>{isConnected ? 'Wallet Connected' : 'Connect Wallet'}</span>
                    </button>

                    {/* Wallet ID Label */}
                    <div className={`mt-2 text-xs font-medium text-gray-500 md:text-sm ${isConnected ? 'block' : 'hidden'}`}>
                        0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 md:px-6 md:py-4">
                    <h2 className="text-sm font-bold text-gray-900 md:text-base">Stake FELY Pending Approvals</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">FX Code</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">Capital</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">Interest</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">Wallet Address</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">Date</th>
                                <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Row 1 */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">FX15518</td>
                                <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">7213.00</td>
                                <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">1442.60</td>
                                <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                                    0x877942d143d7C73b53D7cE020792cAda21ed7876</td>
                                <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">2026-02-13</td>
                                <td className="px-4 py-2 text-center whitespace-nowrap md:px-6 md:py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="rounded bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm hover:bg-emerald-600 transition-all uppercase tracking-wide">
                                            Approve
                                        </button>
                                        <button className="rounded bg-red-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm hover:bg-red-600 transition-all uppercase tracking-wide">
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* Other rows skipped for brevity as this is a mock */}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
