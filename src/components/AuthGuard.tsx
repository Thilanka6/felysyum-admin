"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  // Still checking
  if (isAuthed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-auth-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#F39F29]" />
      </div>
    );
  }

  return <>{children}</>;
}
