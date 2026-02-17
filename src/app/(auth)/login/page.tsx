import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen bg-dark-auth-900">
            {/* Left Side: Branding / Visual */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 h-full w-full bg-dark-auth-900">
                    {/* Abstract Background Pattern */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: "radial-gradient(#C6F128 1px, transparent 1px)",
                            backgroundSize: "32px 32px",
                        }}
                    ></div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-auth-900 via-dark-auth-900/50 to-transparent"></div>

                    <div className="flex h-full flex-col justify-end p-8">
                        <div className="mb-4">
                            <img
                                src="/assets/images/mat-logo.png"
                                alt="Feliciamatrix"
                                className="h-10 w-auto mb-4"
                            />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-white mb-2">
                            Welcome to <span className="text-brand">Feliciamatrix</span>
                        </h1>
                        <p className="text-base text-gray-400 max-w-md">
                            Manage your digital ecosystem with precision and style. Access your dashboard to monitor
                            performance and transactions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-dark-auth-800">
                <div className="mx-auto w-full max-w-sm lg:w-80">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <img
                            src="/assets/images/mat-logo.png"
                            alt="Feliciamatrix"
                            className="h-8 w-auto mx-auto"
                        />
                    </div>

                    <div>
                        <h2 className="mt-4 text-xl font-bold leading-9 tracking-tight text-white font-display">
                            Sign in to your account
                        </h2>
                        <p className="mt-1 text-xs leading-6 text-gray-400">
                            Not a member?{" "}
                            <a href="#" className="font-semibold text-brand hover:text-brand-hover hover:underline">
                                Contact Admin
                            </a>
                        </p>
                    </div>

                    <div className="mt-8">
                        <form className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-medium leading-6 text-gray-300"
                                >
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-lg border-0 bg-dark-auth-700 py-2.5 text-white shadow-sm ring-1 ring-inset ring-dark-auth-600 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-xs sm:leading-6 pl-3 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-medium leading-6 text-gray-300"
                                >
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-lg border-0 bg-dark-auth-700 py-2.5 text-white shadow-sm ring-1 ring-inset ring-dark-auth-600 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-xs sm:leading-6 pl-3 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-600 bg-dark-auth-700 text-brand focus:ring-brand focus:ring-offset-dark-auth-800"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-xs text-gray-300"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-xs">
                                    <Link
                                        href="/forgot-password"
                                        className="font-semibold text-brand hover:text-brand-hover"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <Link
                                    href="/"
                                    className="flex w-full justify-center rounded-lg bg-brand px-3 py-2.5 text-xs font-bold leading-6 text-dark-auth-900 shadow-glow hover:bg-brand-hover hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-all uppercase tracking-wide"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
