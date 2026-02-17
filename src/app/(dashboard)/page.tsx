export default function DashboardPage() {
    return (
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {/* Total Users */}
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 md:text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1 md:text-3xl">12,345</p>
                    </div>
                    <div className="rounded-full bg-blue-50 p-2 text-blue-600 md:p-3">
                        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs md:text-sm">
                    <span className="text-green-500 font-medium flex items-center">
                        <svg className="h-3 w-3 mr-1 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +2.5%
                    </span>
                    <span className="ml-2 text-gray-400">from last month</span>
                </div>
            </div>

            {/* Total Volume */}
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 md:text-sm">Total Volume</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1 md:text-3xl">$4.2M</p>
                    </div>
                    <div className="rounded-full bg-green-50 p-2 text-green-600 md:p-3">
                        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs md:text-sm">
                    <span className="text-green-500 font-medium flex items-center">
                        <svg className="h-3 w-3 mr-1 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +12%
                    </span>
                    <span className="ml-2 text-gray-400">from last month</span>
                </div>
            </div>
        </div>
    );
}
