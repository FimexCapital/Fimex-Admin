"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("fimex_token");
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-panel-bg">
      <div className="animate-pulse text-navy font-bold text-lg">Cargando...</div>
    </div>
  );
}
