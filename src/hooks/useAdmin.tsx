import { useEffect, useState } from "react";

interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export function useAdmin() {
  const [admin, setAdmin] = useState<AdminData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) {
      setAdmin(JSON.parse(stored));
    }
  }, []);

  return admin;
}
