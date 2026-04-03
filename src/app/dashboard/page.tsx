"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { fmt } from "@/lib/amortizacion";
import type { Cliente, SimulacionGuardada } from "@/types";

function StatCard({ label, value, change, icon, accent }: { label: string; value: string; change?: string; icon: string; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-panel-border p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-navy/40 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-extrabold text-navy mt-1 tracking-tight">{value}</p>
          {change && <p className="text-xs font-semibold text-emerald-600 mt-1">{change}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: accent + "15" }}>
          <svg className="w-5 h-5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function RecentActivity({ items }: { items: { label: string; detail: string; time: string; type: string }[] }) {
  const typeColors: Record<string, string> = {
    simulacion: "#C8142F", cliente: "#242F5D", documento: "#C9980A",
  };
  return (
    <div className="bg-white rounded-xl border border-panel-border overflow-hidden">
      <div className="px-5 py-4 border-b border-panel-border flex items-center gap-2">
        <div className="w-1 h-5 bg-fimex-red rounded" />
        <h3 className="text-sm font-extrabold text-navy">Actividad Reciente</h3>
      </div>
      <div className="divide-y divide-panel-border">
        {items.map((item, i) => (
          <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-panel-bg/50">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColors[item.type] || "#242F5D" }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy truncate">{item.label}</p>
              <p className="text-xs text-navy/40 truncate">{item.detail}</p>
            </div>
            <span className="text-[10px] text-navy/30 font-medium flex-shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [simulaciones, setSimulaciones] = useState<SimulacionGuardada[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("fimex_clientes");
    if (saved) setClientes(JSON.parse(saved));
    const sims = localStorage.getItem("fimex_simulaciones");
    if (sims) setSimulaciones(JSON.parse(sims));
  }, []);

  const totalCartera = simulaciones.reduce((sum, s) => sum + s.monto, 0);
  const activos = clientes.filter((c) => c.estatus === "activo").length;

  const recentItems = [
    ...simulaciones.slice(-5).reverse().map((s) => ({
      label: `Simulación — ${s.clienteNombre}`,
      detail: `${fmt(s.monto)} a ${s.plazo} meses`,
      time: new Date(s.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
      type: "simulacion",
    })),
    ...clientes.slice(-5).reverse().map((c) => ({
      label: `Cliente — ${c.nombre}`,
      detail: c.rfc || c.email,
      time: new Date(c.fechaAlta).toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
      type: "cliente",
    })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 8);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy tracking-tight">Dashboard</h1>
        <p className="text-sm text-navy/40 mt-0.5">Resumen general del sistema</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Clientes Registrados" value={String(clientes.length)} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" accent="#242F5D" />
        <StatCard label="Clientes Activos" value={String(activos)} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" accent="#1D8B5E" />
        <StatCard label="Simulaciones" value={String(simulaciones.length)} icon="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" accent="#C8142F" />
        <StatCard label="Cartera Simulada" value={fmt(totalCartera)} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" accent="#C9980A" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity */}
        <div className="lg:col-span-2">
          <RecentActivity items={recentItems.length > 0 ? recentItems : [
            { label: "Sin actividad aún", detail: "Crea tu primer cliente o simulación", time: "—", type: "cliente" },
          ]} />
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-panel-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-navy rounded" />
            <h3 className="text-sm font-extrabold text-navy">Acciones Rápidas</h3>
          </div>
          <div className="space-y-2">
            {[
              { href: "/simulador", label: "Nueva Simulación", color: "bg-fimex-red" },
              { href: "/clientes", label: "Registrar Cliente", color: "bg-navy" },
              { href: "/documentos", label: "Generar Documento", color: "bg-navy-light" },
            ].map((a) => (
              <a
                key={a.href}
                href={a.href}
                className={`block w-full text-center py-2.5 text-white text-sm font-bold rounded-lg ${a.color} hover:opacity-90`}
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
