"use client";

import { useState } from 'react';

export default function CompletedWithdrawalPage() {
    const [copiedHash, setCopiedHash] = useState<string | null>(null);

    const copyToClipboard = (hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header / Title */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Completed Withdrawals</h1>
                {/* Breadcrumbs could go here if needed */}
                <span className="text-xs text-gray-500">Pages {'>'} Completed Withdrawals</span>
            </div>

            {/* Filter Section - Light Theme matching approve-spending */}
            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6 items-end">
                    {/* FX Code */}
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-900 md:text-sm">
                            Code
                        </label>
                        <input
                            type="text"
                            placeholder="Enter  Code"
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
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            SEARCH
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200" title="Reset">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section - Light Theme matching approve-spending */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 md:px-6 md:py-4">
                    <h2 className="text-sm font-bold text-gray-900 md:text-base">Stake FELY Completed Withdrawals</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-50 text-[10px] uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3"> Code</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3 text-right">Capital</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3 text-right">Interest</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">Wallet Address</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">Transaction Hash</th>
                                <th className="px-4 py-2 font-semibold whitespace-nowrap md:px-6 md:py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Row 1 */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">FX14969</td>
                                <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">2,845.00</td>
                                <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">426.75</td>
                                <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                                    0xE7B7F3F1e9DEd4AF06DedFbB5180c06433259631
                                </td>
                                <td className="px-4 py-2 text-gray-500 md:px-6 md:py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="block truncate max-w-[200px]" title="0xd1bbea6fffd6357967e0c74dd51698230acb3c736889623e0c1decb1...">0xd1bbea6fffd6357967e0c74dd51698230acb3c736889623e0c1decb1...</span>
                                        <button
                                            onClick={() => copyToClipboard('0xd1bbea6fffd6357967e0c74dd51698230acb3c736889623e0c1decb1...')}
                                            className="text-gray-400 hover:text-brand transition-colors"
                                            title="Copy Hash"
                                        >
                                            {copiedHash === '0xd1bbea6fffd6357967e0c74dd51698230acb3c736889623e0c1decb1...' ? (
                                                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-gray-500 md:px-6 md:py-3">2026-02-23</td>
                            </tr>
                            {/* Row 2 */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">15665</td>
                                <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">1,437.00</td>
                                <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">143.70</td>
                                <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                                    0xdb7cf5A0a958fbcd5705D0640ed4a438241cF604
                                </td>
                                <td className="px-4 py-2 text-gray-500 md:px-6 md:py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="block truncate max-w-[200px]" title="0x078edc3c2b65d67e7b1a2792eee866ea69aa21ba2009806de8956679...">0x078edc3c2b65d67e7b1a2792eee866ea69aa21ba2009806de8956679...</span>
                                        <button
                                            onClick={() => copyToClipboard('0x078edc3c2b65d67e7b1a2792eee866ea69aa21ba2009806de8956679...')}
                                            className="text-gray-400 hover:text-brand transition-colors"
                                            title="Copy Hash"
                                        >
                                            {copiedHash === '0x078edc3c2b65d67e7b1a2792eee866ea69aa21ba2009806de8956679...' ? (
                                                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-gray-500 md:px-6 md:py-3">2026-02-23</td>
                            </tr>
                            {/* Row 3 */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">FX15660</td>
                                <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">1,437.00</td>
                                <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">143.70</td>
                                <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                                    0xb8400ae6F4044c2e45F17bf7EE0831CB587Fb00c
                                </td>
                                <td className="px-4 py-2 text-gray-500 md:px-6 md:py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="block truncate max-w-[200px]" title="0x5b7b016a77de9fd1e908796ffd5f46aa609a57da04335bdc7ed9c25b...">0x5b7b016a77de9fd1e908796ffd5f46aa609a57da04335bdc7ed9c25b...</span>
                                        <button
                                            onClick={() => copyToClipboard('0x5b7b016a77de9fd1e908796ffd5f46aa609a57da04335bdc7ed9c25b...')}
                                            className="text-gray-400 hover:text-brand transition-colors"
                                            title="Copy Hash"
                                        >
                                            {copiedHash === '0x5b7b016a77de9fd1e908796ffd5f46aa609a57da04335bdc7ed9c25b...' ? (
                                                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-gray-500 md:px-6 md:py-3">2026-02-23</td>
                            </tr>
                            {/* Row 4 */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">FX15656</td>
                                <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">1,437.00</td>
                                <td className="px-4 py-2 whitespace-nowrap text-right md:px-6 md:py-3">143.70</td>
                                <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                                    0x368190D81e7F176D499E571B281e1B69Fdf3583e
                                </td>
                                <td className="px-4 py-2 text-gray-500 md:px-6 md:py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="block truncate max-w-[200px]" title="0xb5eae2bd552999f3dce78ed7a9d9a1389c5518afcc02df0fa6afdcc0...">0xb5eae2bd552999f3dce78ed7a9d9a1389c5518afcc02df0fa6afdcc0...</span>
                                        <button
                                            onClick={() => copyToClipboard('0xb5eae2bd552999f3dce78ed7a9d9a1389c5518afcc02df0fa6afdcc0...')}
                                            className="text-gray-400 hover:text-brand transition-colors"
                                            title="Copy Hash"
                                        >
                                            {copiedHash === '0xb5eae2bd552999f3dce78ed7a9d9a1389c5518afcc02df0fa6afdcc0...' ? (
                                                <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-gray-500 md:px-6 md:py-3">2026-02-23</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
