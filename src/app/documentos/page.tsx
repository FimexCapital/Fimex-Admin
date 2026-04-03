"use client";
import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { calcularAmortizacion, fmt, fmtPct } from "@/lib/amortizacion";
import type { Cliente, SimulacionGuardada } from "@/types";

export default function DocumentosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [simulaciones, setSimulaciones] = useState<SimulacionGuardada[]>([]);
  const [selectedSim, setSelectedSim] = useState("");
  const [docType, setDocType] = useState("amortizacion");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const c = localStorage.getItem("fimex_clientes");
    if (c) setClientes(JSON.parse(c));
    const s = localStorage.getItem("fimex_simulaciones");
    if (s) setSimulaciones(JSON.parse(s));
  }, []);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const sim = simulaciones.find((s) => s.id === selectedSim);
      if (!sim) { alert("Selecciona una simulación"); return; }

      const result = calcularAmortizacion({
        monto: sim.monto, plazo: sim.plazo, tasaAnual: sim.tasaAnual,
        comisionApertura: 0, comisionAdmin: 0, comisionInvestigacion: 0, ivaIntereses: false,
      });

      const doc = new jsPDF();
      const navy: [number, number, number] = [36, 47, 93];
      const red: [number, number, number] = [200, 20, 47];
      const w = doc.internal.pageSize.getWidth();

      // Header bar
      doc.setFillColor(...navy);
      doc.rect(0, 0, w, 28, "F");
      doc.setFillColor(...red);
      doc.rect(0, 28, w, 1.5, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("FIMEX CAPITAL", 14, 15);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("SOFOM E.N.R.", 14, 22);

      doc.setFontSize(8);
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}`, w - 14, 15, { align: "right" });

      // Title
      let y = 40;
      doc.setTextColor(...navy);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Tabla de Amortización", 14, y);

      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Crédito Simple — Sistema Francés (Cuota Fija)", 14, y);

      // Credit info box
      y += 10;
      doc.setFillColor(244, 245, 250);
      doc.roundedRect(14, y, w - 28, 30, 2, 2, "F");

      doc.setFontSize(8);
      doc.setTextColor(...navy);
      const infoItems = [
        [`Acreditado: ${sim.clienteNombre}`, `Monto: ${fmt(sim.monto)}`],
        [`Tasa anual: ${sim.tasaAnual}%`, `Plazo: ${sim.plazo} meses`],
        [`Pago mensual: ${fmt(result.pagoMensual)}`, `Tasa mensual: ${fmtPct(result.tasaMensual)}`],
      ];

      let iy = y + 8;
      infoItems.forEach((row) => {
        doc.setFont("helvetica", "bold");
        doc.text(row[0], 20, iy);
        doc.text(row[1], w / 2 + 10, iy);
        iy += 8;
      });

      y += 38;

      // Table
      const tableData = result.rows.map((r) => [
        String(r.mes),
        fmt(r.saldoInicial),
        fmt(r.pago),
        fmt(r.interes),
        fmt(r.capital),
        fmt(r.saldoFinal),
      ]);

      // Add totals row
      tableData.push([
        "",
        "TOTALES",
        fmt(result.totalPagado),
        fmt(result.totalIntereses),
        fmt(result.totalCapital),
        fmt(0),
      ]);

      autoTable(doc, {
        startY: y,
        head: [["No.", "Saldo Inicial", "Pago Total", "Interés", "Capital", "Saldo Final"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: navy, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7, halign: "right" },
        bodyStyles: { fontSize: 7.5, textColor: navy, halign: "right" },
        columnStyles: { 0: { halign: "center", fontStyle: "bold" } },
        alternateRowStyles: { fillColor: [244, 245, 250] },
        margin: { left: 14, right: 14 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        didParseCell: (data: any) => {
          // Style totals row
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fillColor = navy;
            data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      // Footer
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFillColor(244, 245, 250);
      doc.rect(0, pageH - 15, w, 15, "F");
      doc.setFillColor(...navy);
      doc.rect(0, pageH - 15, w, 0.5, "F");
      doc.setFontSize(6);
      doc.setTextColor(130, 130, 130);
      doc.text("FIMEX CAPITAL — Documento generado para uso interno y del acreditado. Sujeto a los términos del contrato de crédito.", 14, pageH - 6);
      doc.text("SOFOM E.N.R.", w - 14, pageH - 6, { align: "right" });

      doc.save(`Amortizacion_${sim.clienteNombre.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error al generar el PDF. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy tracking-tight">Documentos</h1>
        <p className="text-sm text-navy/40 mt-0.5">Generador de documentos PDF</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Generator */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-panel-border p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-fimex-red rounded" />
            <h2 className="text-sm font-extrabold text-navy">Generar Documento</h2>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Tipo de documento</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-navy/15">
              <option value="amortizacion">Tabla de Amortización</option>
              <option value="cotizacion">Cotización de Crédito</option>
              <option value="expediente">Carátula de Expediente</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">Simulación base</label>
            {simulaciones.length === 0 ? (
              <div className="px-4 py-8 bg-panel-bg rounded-lg text-center">
                <p className="text-navy/30 font-semibold text-sm">No hay simulaciones guardadas</p>
                <p className="text-xs text-navy/20 mt-1">Ve al módulo de Simulador, calcula y guarda una simulación primero</p>
                <a href="/simulador" className="inline-block mt-3 px-4 py-2 bg-fimex-red text-white text-xs font-bold rounded-lg">Ir al Simulador</a>
              </div>
            ) : (
              <select value={selectedSim} onChange={(e) => setSelectedSim(e.target.value)}
                className="w-full px-3 py-2.5 border border-panel-border rounded-lg text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-navy/15">
                <option value="">Selecciona una simulación...</option>
                {simulaciones.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.clienteNombre} — {fmt(s.monto)} a {s.plazo} meses ({new Date(s.fecha).toLocaleDateString("es-MX")})
                  </option>
                ))}
              </select>
            )}
          </div>

          {simulaciones.length > 0 && (
            <button onClick={generatePDF} disabled={!selectedSim || generating}
              className="w-full py-3 bg-fimex-red hover:bg-fimex-red-dark text-white font-extrabold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-fimex-red/25 disabled:opacity-40 disabled:cursor-not-allowed">
              {generating ? "Generando PDF..." : "Descargar PDF"}
            </button>
          )}
        </div>

        {/* Recent documents info */}
        <div className="bg-white rounded-xl border border-panel-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-navy rounded" />
            <h3 className="text-sm font-extrabold text-navy">Simulaciones Disponibles</h3>
          </div>
          {simulaciones.length === 0 ? (
            <p className="text-xs text-navy/25 text-center py-8">Sin simulaciones</p>
          ) : (
            <div className="space-y-2">
              {simulaciones.slice(-6).reverse().map((s) => (
                <div key={s.id} className="p-3 bg-panel-bg rounded-lg">
                  <p className="text-xs font-bold text-navy truncate">{s.clienteNombre}</p>
                  <p className="text-[10px] text-navy/30 mt-0.5">
                    {fmt(s.monto)} · {s.plazo}m · {s.tasaAnual}% · Pago: {fmt(s.pagoMensual)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

  );
}
