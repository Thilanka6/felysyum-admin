"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null); // null = still checking

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

  return isAuthed;
}