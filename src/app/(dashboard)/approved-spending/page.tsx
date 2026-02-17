export default function ApprovedSpendingPage() {
    return (
        <>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 md:px-6 md:py-4">
                    <h2 className="text-sm font-bold text-gray-900 md:text-base">Stake FELY Approved List</h2>
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
                                <th className="px-4 py-2 font-semibold text-center whitespace-nowrap md:px-6 md:py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Row 1 */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap md:px-6 md:py-3">FX15200</td>
                                <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">5000.00</td>
                                <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">1000.00</td>
                                <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap md:px-6 md:py-3">
                                    0x71C7656EC7ab88b098defB751B7401B5f6d8976F</td>
                                <td className="px-4 py-2 whitespace-nowrap md:px-6 md:py-3">2026-02-12</td>
                                <td className="px-4 py-2 text-center whitespace-nowrap md:px-6 md:py-3">
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        Approved
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
