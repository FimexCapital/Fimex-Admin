"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("fimex_token");
    if (!token) {
      router.replace("/login");
    } else {
      setOk(true);
    }
  }, [router]);

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-panel-bg">
        <div className="animate-pulse text-navy font-bold">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-panel-bg">
      <Sidebar />
      <main className="ml-60 p-6 min-h-screen">{children}</main>
    </div>
  );
}
