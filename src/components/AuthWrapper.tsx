"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    if (!token && !isPublic) {
      router.replace("/login");
    } else {
      setIsAuthed(true);
    }
  }, [pathname, router]);

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // Public routes → show immediately, no spinner
  if (isPublic) {
    return <>{children}</>;
  }

  // Protected routes → show spinner while checking
  if (isAuthed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-auth-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#F39F29]" />
      </div>
    );
  }

  // Authenticated → show page
  return <>{children}</>;
}
