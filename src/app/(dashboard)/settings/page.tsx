export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-4xl">
            <h2 className="text-base font-medium text-gray-900 mb-4 md:text-lg md:mb-6">Account Settings</h2>

            {/* Profile Section */}
            <div className="bg-white shadow-sm sm:rounded-lg mb-6 border border-gray-100 md:mb-8">
                <div className="px-4 py-4 sm:p-6">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900 md:text-base">Profile Information</h3>
                    <div className="mt-1 max-w-xl text-xs text-gray-500 md:text-sm">
                        <p>Your account's profile information.</p>
                    </div>
                    {/* Read-only View */}
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="block text-xs font-medium leading-6 text-gray-500 md:text-sm">Name</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    disabled
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-200 sm:text-xs sm:leading-6 pl-3 cursor-not-allowed md:text-sm"
                                    defaultValue="Admin User"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium leading-6 text-gray-500 md:text-sm">Email</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    disabled
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-200 sm:text-xs sm:leading-6 pl-3 cursor-not-allowed md:text-sm"
                                    defaultValue="admin@felysyum.com"
                                />
                            </div>
                        </div>
                        {/* No Save Button */}
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white shadow-sm sm:rounded-lg border border-gray-100">
                <div className="px-4 py-4 sm:p-6">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900 md:text-base">Change Password</h3>
                    <div className="mt-1 max-w-xl text-xs text-gray-500 md:text-sm">
                        <p>Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <form className="mt-4 space-y-4">
                        <div>
                            <label
                                htmlFor="current-password"
                                className="block text-xs font-medium leading-6 text-gray-700 md:text-sm"
                            >
                                Current Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    name="current-password"
                                    id="current-password"
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 pl-3 md:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="new-password"
                                className="block text-xs font-medium leading-6 text-gray-700 md:text-sm"
                            >
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    name="new-password"
                                    id="new-password"
                                    autoComplete="new-password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 pl-3 md:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-xs font-medium leading-6 text-gray-700 md:text-sm"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    autoComplete="new-password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 pl-3 md:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all md:text-sm"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
