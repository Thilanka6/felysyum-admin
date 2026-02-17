export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full bg-dark-auth-900">
            {children}
        </div>
    );
}
