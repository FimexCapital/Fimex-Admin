"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useCallback, useRef } from "react";
import { calcularAmortizacion, fmt, fmtPct } from "@/lib/amortizacion";
import type { AmortizacionResult } from "@/lib/amortizacion";
import type { SimulacionGuardada } from "@/types";

function InputField({ label, value, onChange, type = "number", prefix, suffix, min, max, step, hint }: {
  label: string; value: string | number; onChange: (v: any) => void; type?: string;
  prefix?: string; suffix?: string; min?: number; max?: number; step?: number; hint?: string;
}) {
  return (
    <div className="mb-3.5">
      <label className="block text-[11px] font-bold text-navy/50 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex items-center bg-white border border-panel-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-navy/15 focus-within:border-navy">
        {prefix && <span className="px-3 text-navy/30 text-sm font-bold bg-panel-bg border-r border-panel-border h-10 flex items-center">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
          min={min} max={max} step={step || "any"}
          className="flex-1 border-none outline-none px-3 py-2.5 text-sm font-medium text-navy bg-transparent"
        />
        {suffix && <span className="px-3 text-navy/30 text-xs font-semibold">{suffix}</span>}
      </div>
      {hint && <p className="text-[10px] text-navy/30 mt-0.5 italic">{hint}</p>}
    </div>
  );
}

export default function SimuladorPage() {
  const [acreditado, setAcreditado] = useState("Erick Enrique Sánchez Román");
  const [monto, setMonto] = useState(50000);
  const [plazo, setPlazo] = useState(12);
  const [tasaAnual, setTasaAnual] = useState(12);
  const [comApertura, setComApertura] = useState(0);
  const [comAdmin, setComAdmin] = useState(0);
  const [comInvest, setComInvest] = useState(0);
  const [ivaIntereses, setIvaIntereses] = useState(false);
  const [resultado, setResultado] = useState<AmortizacionResult | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [saved, setSaved] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const simular = useCallback(() => {
    const r = calcularAmortizacion({
      monto, plazo, tasaAnual, comisionApertura: comApertura,
      comisionAdmin: comAdmin, comisionInvestigacion: comInvest, ivaIntereses,
    });
    setResultado(r);
    setShowTable(true);
    setSaved(false);
    setTimeout(() => tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, [monto, plazo, tasaAnual, comApertura, comAdmin, comInvest, ivaIntereses]);

  const guardarSimulacion = () => {
    if (!resultado) return;
    const sim: SimulacionGuardada = {
      id: Date.now().toString(36),
      clienteNombre: acreditado || "Sin nombre",
      monto, plazo, tasaAnual,
      pagoMensual: resultado.pagoMensual,
      totalPagado: resultado.totalPagado,
      fecha: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("fimex_simulaciones") || "[]");
    existing.push(sim);
    localStorage.setItem("fimex_simulaciones", JSON.stringify(existing));
    setSaved(true);
  };

  const limpiar = () => {
    setAcreditado(""); setMonto(0); setPlazo(12); setTasaAnual(12);
    setComApertura(0); setComAdmin(0); setComInvest(0); setIvaIntereses(false);
    setResultado(null); setShowTable(false); setSaved(false);
  };

  const tieneComisiones = comApertura > 0 || comAdmin > 0 || comInvest > 0;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy tracking-tight">Simulador de Amortización</h1>
        <p className="text-sm text-navy/40 mt-0.5">Sistema francés — cuota fija</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-panel-border p-5 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-fimex-red rounded" />
          <h2 className="text-sm font-extrabold text-navy">Parámetros del Crédito</h2>
        </div>

        <InputField label="Nombre del acreditado" value={acreditado} onChange={setAcreditado} type="text" />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Monto del crédito" value={monto} onChange={setMonto} prefix="$" min={1000} />
          <InputField label="Plazo" value={plazo} onChange={setPlazo} suffix="meses" min={1} max={360} step={1} />
        </div>
        <InputField label="Tasa de interés anual fija" value={tasaAnual} onChange={setTasaAnual} suffix="%" min={0} max={200}
          hint={`Tasa mensual equivalente: ${fmtPct(tasaAnual / 12)}`} />

        {/* Comisiones */}
        <div className="mt-2 p-4 bg-panel-bg rounded-lg border border-dashed border-panel-border">
          <p className="text-[11px] font-extrabold text-navy uppercase tracking-wider mb-3">
            Comisiones <span className="font-normal text-navy/30 normal-case tracking-normal">— porcentaje sobre monto</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <InputField label="Apertura" value={comApertura} onChange={setComApertura} suffix="%" min={0} max={20} />
            <InputField label="Administración" value={comAdmin} onChange={setComAdmin} suffix="%" min={0} max={20} />
            <InputField label="Investigación" value={comInvest} onChange={setComInvest} suffix="%" min={0} max={20} />
          </div>
        </div>

        {/* IVA Toggle */}
        <div className="mt-4 flex items-start gap-3 cursor-pointer select-none" onClick={() => setIvaIntereses(!ivaIntereses)}>
          <div className={`w-9 h-5 rounded-full relative flex-shrink-0 mt-0.5 ${ivaIntereses ? "bg-fimex-red" : "bg-panel-border"}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition-all ${ivaIntereses ? "left-[18px]" : "left-0.5"}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-navy">Cobrar IVA sobre intereses</p>
            <p className="text-[10px] text-navy/30">Desactivado por defecto (SOFOM E.N.R. — Art. 8 fracc. IV LIVA)</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button onClick={simular}
            className="flex-1 py-3 bg-fimex-red hover:bg-fimex-red-dark text-white font-extrabold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-fimex-red/25">
            Calcular Amortización
          </button>
          <button onClick={limpiar}
            className="px-5 py-3 border border-panel-border text-navy/40 hover:text-navy hover:border-navy font-bold text-sm rounded-lg">
            Limpiar
          </button>
        </div>
      </div>

      {/* Results */}
      {resultado && showTable && (
        <div ref={tableRef}>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {[
              { l: "Pago Mensual", v: fmt(resultado.pagoMensual), c: "#C8142F" },
              { l: "Total Intereses", v: fmt(resultado.totalIntereses), c: "#C9980A" },
              { l: "Total a Pagar", v: fmt(resultado.totalPagado), c: "#242F5D" },
              { l: "Costo Financiero", v: `${((resultado.totalIntereses / monto) * 100).toFixed(2)}%`, c: "#1D8B5E" },
            ].map((s) => (
              <div key={s.l} className="bg-white rounded-lg border border-panel-border p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: s.c }} />
                <p className="text-[10px] font-bold text-navy/30 uppercase tracking-wider">{s.l}</p>
                <p className="text-lg font-extrabold mt-1 tracking-tight" style={{ color: s.c }}>{s.v}</p>
              </div>
            ))}
          </div>

          {/* Info bar */}
          {acreditado && (
            <div className="bg-navy rounded-lg px-4 py-2.5 mb-3 flex flex-wrap gap-4 text-xs">
              {[["Acreditado", acreditado], ["Monto", fmt(monto)], ["Tasa", `${tasaAnual}% anual`], ["Plazo", `${plazo} meses`]].map(([k, v]) => (
                <div key={k}><span className="text-white/30 uppercase tracking-wider">{k}: </span><span className="text-white font-bold">{v}</span></div>
              ))}
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl border border-panel-border overflow-hidden mb-4">
            <div className="bg-navy px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 bg-fimex-red rounded" />
                <h3 className="text-xs font-extrabold text-white">Tabla de Amortización</h3>
              </div>
              <span className="text-[10px] text-white/40">Tasa mensual: {fmtPct(resultado.tasaMensual)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-panel-bg">
                    {["No.", "Saldo Inicial", "Pago Total", "Interés", ...(ivaIntereses ? ["IVA Int."] : []), "Capital", ...(tieneComisiones ? ["Comisiones", "IVA Com."] : []), "Saldo Final"].map((h, i) => (
                      <th key={i} className={`px-3 py-2.5 text-[10px] font-extrabold text-navy uppercase tracking-wider border-b-2 border-panel-border whitespace-nowrap ${i === 0 ? "text-center" : "text-right"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultado.rows.map((row, i) => (
                    <tr key={row.mes} className={`${i % 2 === 0 ? "bg-white" : "bg-panel-bg/50"} hover:bg-fimex-red/5`}>
                      <td className="px-3 py-2 text-center font-bold text-fimex-red">{row.mes}</td>
                      <td className="px-3 py-2 text-right text-navy">{fmt(row.saldoInicial)}</td>
                      <td className="px-3 py-2 text-right font-bold text-navy">{fmt(row.pago)}</td>
                      <td className="px-3 py-2 text-right text-amber-600">{fmt(row.interes)}</td>
                      {ivaIntereses && <td className="px-3 py-2 text-right text-navy/30">{fmt(row.ivaInteres)}</td>}
                      <td className="px-3 py-2 text-right text-emerald-700 font-semibold">{fmt(row.capital)}</td>
                      {tieneComisiones && <>
                        <td className="px-3 py-2 text-right text-navy/30">{row.comisiones > 0 ? fmt(row.comisiones) : "—"}</td>
                        <td className="px-3 py-2 text-right text-navy/30">{row.ivaComisiones > 0 ? fmt(row.ivaComisiones) : "—"}</td>
                      </>}
                      <td className={`px-3 py-2 text-right font-bold ${row.saldoFinal === 0 ? "text-emerald-700" : "text-navy"}`}>{fmt(row.saldoFinal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-navy text-white">
                    <td className="px-3 py-2.5" />
                    <td className="px-3 py-2.5 text-right text-[10px] font-bold text-white/40 uppercase">Totales</td>
                    <td className="px-3 py-2.5 text-right font-extrabold">{fmt(resultado.totalPagado)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-amber-400">{fmt(resultado.totalIntereses)}</td>
                    {ivaIntereses && <td className="px-3 py-2.5 text-right text-white/40">{fmt(resultado.totalIvaInt)}</td>}
                    <td className="px-3 py-2.5 text-right font-extrabold text-emerald-400">{fmt(resultado.totalCapital)}</td>
                    {tieneComisiones && <>
                      <td className="px-3 py-2.5 text-right text-white/40">{fmt(resultado.totalComisiones)}</td>
                      <td className="px-3 py-2.5 text-right text-white/40">{fmt(resultado.ivaComisiones)}</td>
                    </>}
                    <td className="px-3 py-2.5 text-right font-extrabold text-emerald-400">{fmt(0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Save button */}
          <div className="flex gap-3">
            <button onClick={guardarSimulacion} disabled={saved}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold ${saved ? "bg-emerald-600 text-white cursor-default" : "bg-navy text-white hover:bg-navy-light"}`}>
              {saved ? "✓ Simulación Guardada" : "Guardar Simulación"}
            </button>
          </div>

          {/* Technical note */}
          <div className="mt-4 bg-white rounded-lg border border-panel-border border-l-4 border-l-navy p-4">
            <h4 className="text-[11px] font-extrabold text-navy uppercase tracking-wider mb-2">Nota Técnica — Método de Cálculo</h4>
            <p className="text-[11px] text-navy/50 leading-relaxed">
              Cálculo bajo <strong>sistema francés</strong> (cuota fija). Fórmula: PMT = PV × [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> – 1].
              Tasa mensual = {fmtPct(resultado.tasaMensual)}. El último periodo se ajusta para cerrar saldo en $0.00 exactos.
              {!ivaIntereses && " No se aplica IVA sobre intereses (SOFOM E.N.R., Art. 8 fracc. IV LIVA)."}
              {!tieneComisiones && " Sin comisiones aplicables."}
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
