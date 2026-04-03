"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import type { Cliente } from "@/types";

const TIPO_LABELS: Record<string, string> = { PF: "Persona Física", PFAE: "PF con Act. Empresarial", PM: "Persona Moral" };
const STATUS_STYLES: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  inactivo: "bg-red-100 text-red-700",
  prospecto: "bg-amber-100 text-amber-700",
};

function ClienteModal({ cliente, onSave, onClose }: { cliente?: Cliente; onSave: (c: Cliente) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<Cliente>>(cliente || {
    nombre: "", rfc: "", email: "", telefono: "", tipo: "PFAE", estatus: "prospecto", notas: "",
  });

  const handleSave = () => {
    const c: Cliente = {
      id: form.id || Date.now().toString(36),
      nombre: form.nombre || "",
      rfc: form.rfc || "",
      email: form.email || "",
      telefono: form.telefono || "",
      tipo: (form.tipo as Cliente["tipo"]) || "PFAE",
      estatus: (form.estatus as Cliente["estatus"]) || "prospecto",
      fechaAlta: form.fechaAlta || new Date().toISOString(),
      notas: form.notas || "",
    };
    onSave(c);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-navy px-5 py-4 rounded-t-xl flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white">{cliente ? "Editar Cliente" : "Nuevo Cliente"}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-lg">&times;</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Nombre completo / Razón social</label>
            <input value={form.nombre || ""} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/15" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">RFC</label>
              <input value={form.rfc || ""} onChange={(e) => setForm({ ...form, rfc: e.target.value.toUpperCase() })}
                maxLength={13} className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/15 uppercase" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Teléfono</label>
              <input value={form.telefono || ""} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/15" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Email</label>
            <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/15" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Tipo</label>
              <select value={form.tipo || "PFAE"} onChange={(e) => setForm({ ...form, tipo: e.target.value as Cliente["tipo"] })}
                className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/15 bg-white">
                <option value="PF">Persona Física</option>
                <option value="PFAE">PF con Act. Empresarial</option>
                <option value="PM">Persona Moral</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Estatus</label>
              <select value={form.estatus || "prospecto"} onChange={(e) => setForm({ ...form, estatus: e.target.value as Cliente["estatus"] })}
                className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/15 bg-white">
                <option value="prospecto">Prospecto</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Notas</label>
            <textarea value={form.notas || ""} onChange={(e) => setForm({ ...form, notas: e.target.value })} rows={2}
              className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/15 resize-none" />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={handleSave}
            className="flex-1 py-2.5 bg-fimex-red hover:bg-fimex-red-dark text-white font-bold text-sm rounded-lg">
            {cliente ? "Guardar Cambios" : "Registrar Cliente"}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 border border-panel-border text-navy/40 font-bold text-sm rounded-lg hover:text-navy hover:border-navy">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | undefined>();

  useEffect(() => {
    const saved = localStorage.getItem("fimex_clientes");
    if (saved) setClientes(JSON.parse(saved));
  }, []);

  const save = (list: Cliente[]) => {
    setClientes(list);
    localStorage.setItem("fimex_clientes", JSON.stringify(list));
  };

  const handleSave = (c: Cliente) => {
    const exists = clientes.findIndex((x) => x.id === c.id);
    if (exists >= 0) {
      const updated = [...clientes];
      updated[exists] = c;
      save(updated);
    } else {
      save([...clientes, c]);
    }
    setModalOpen(false);
    setEditing(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este cliente?")) {
      save(clientes.filter((c) => c.id !== id));
    }
  };

  const filtered = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.rfc.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight">Clientes</h1>
          <p className="text-sm text-navy/40 mt-0.5">Gestión de acreditados</p>
        </div>
        <button onClick={() => { setEditing(undefined); setModalOpen(true); }}
          className="px-5 py-2.5 bg-fimex-red hover:bg-fimex-red-dark text-white font-bold text-sm rounded-lg shadow-lg shadow-fimex-red/25">
          + Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, RFC o email..."
          className="w-full max-w-md px-4 py-2.5 bg-white border border-panel-border rounded-lg text-sm text-navy placeholder:text-navy/25 focus:outline-none focus:ring-2 focus:ring-navy/15" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-panel-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <p className="text-navy/30 font-semibold">No hay clientes registrados</p>
            <p className="text-xs text-navy/20 mt-1">Haz clic en &quot;+ Nuevo Cliente&quot; para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panel-bg border-b-2 border-panel-border">
                  {["Nombre", "RFC", "Tipo", "Estatus", "Email", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-extrabold text-navy uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-panel-bg/50">
                    <td className="px-4 py-3 font-semibold text-navy">{c.nombre}</td>
                    <td className="px-4 py-3 text-navy/60 font-mono text-xs">{c.rfc || "—"}</td>
                    <td className="px-4 py-3 text-xs text-navy/50">{TIPO_LABELS[c.tipo] || c.tipo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[c.estatus]}`}>{c.estatus}</span>
                    </td>
                    <td className="px-4 py-3 text-navy/40 text-xs">{c.email || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(c); setModalOpen(true); }}
                          className="text-navy/30 hover:text-navy text-xs font-bold">Editar</button>
                        <button onClick={() => handleDelete(c.id)}
                          className="text-navy/30 hover:text-fimex-red text-xs font-bold">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && <ClienteModal cliente={editing} onSave={handleSave} onClose={() => { setModalOpen(false); setEditing(undefined); }} />}
    </AdminLayout>
  );
}
