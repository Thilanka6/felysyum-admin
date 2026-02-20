import { useEffect, useState } from "react";

interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthData {
  admin: AdminData;
  token: string;
  expires_at: string;
  expires_in_hours: number;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export function useAdmin() {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) {
      try {
        const parsed: LoginResponse | AdminData = JSON.parse(stored);

        if ("data" in parsed && parsed.data?.admin) {
          setAdmin(parsed.data.admin);
          setToken(parsed.data.token);
        } else if ("id" in parsed) {
          setAdmin(parsed as AdminData);
        }
      } catch {
        console.error("Failed to parse admin data from localStorage");
      }
    }
  }, []);

  return { admin, token };
}
