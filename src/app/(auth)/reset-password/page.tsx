import Link from "next/link";

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark-auth-900 relative isolate overflow-hidden">
            {/* Background pattern */}
            <div
                className="absolute inset-0 -z-10 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#C6F128 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            ></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm z-10">
                <div className="text-center">
                    <img
                        src="/assets/images/mat-logo.png"
                        alt="Felysyum"
                        className="h-8 w-auto mx-auto mb-4"
                    />
                    <h2 className="text-xl font-bold leading-9 tracking-tight text-white font-display">
                        Set new password
                    </h2>
                    <p className="mt-1 text-xs leading-6 text-gray-400">
                        Secure your account with a strong password.
                    </p>
                </div>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm z-10">
                <div className="bg-dark-auth-800 px-6 py-6 shadow-xl ring-1 ring-white/5 sm:rounded-xl sm:px-8 border border-dark-auth-700">
                    <form className="space-y-4">
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium leading-6 text-gray-300"
                            >
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full rounded-lg border-0 bg-dark-auth-700 py-2.5 text-white shadow-sm ring-1 ring-inset ring-dark-auth-600 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-xs sm:leading-6 pl-3 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-xs font-medium leading-6 text-gray-300"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full rounded-lg border-0 bg-dark-auth-700 py-2.5 text-white shadow-sm ring-1 ring-inset ring-dark-auth-600 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-xs sm:leading-6 pl-3 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <Link
                                href="/login"
                                className="flex w-full justify-center rounded-lg bg-brand px-3 py-2.5 text-xs font-bold leading-6 text-dark-auth-900 shadow-glow hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-all uppercase tracking-wide"
                            >
                                Reset Password & Sign In
                            </Link>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-dark-auth-600"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-dark-auth-800 px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <Link
                                href="/login"
                                className="font-medium text-xs text-brand hover:text-brand-hover flex items-center justify-center gap-2 hover:gap-3 transition-all"
                            >
                                <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
