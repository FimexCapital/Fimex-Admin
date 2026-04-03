export interface AmortizacionParams {
  monto: number;
  plazo: number;
  tasaAnual: number;
  comisionApertura: number;
  comisionAdmin: number;
  comisionInvestigacion: number;
  ivaIntereses: boolean;
}

export interface AmortizacionRow {
  mes: number;
  saldoInicial: number;
  pago: number;
  interes: number;
  ivaInteres: number;
  capital: number;
  comisiones: number;
  ivaComisiones: number;
  saldoFinal: number;
}

export interface AmortizacionResult {
  rows: AmortizacionRow[];
  pagoMensual: number;
  totalIntereses: number;
  totalCapital: number;
  totalIvaInt: number;
  totalComisiones: number;
  ivaComisiones: number;
  totalPagado: number;
  tasaMensual: number;
}

export function calcularAmortizacion(params: AmortizacionParams): AmortizacionResult {
  const { monto, plazo, tasaAnual, comisionApertura, comisionAdmin, comisionInvestigacion, ivaIntereses } = params;
  const tasaMensual = tasaAnual / 100 / 12;
  const n = plazo;

  let pagoMensual: number;
  if (tasaMensual === 0) {
    pagoMensual = monto / n;
  } else {
    const factor = (tasaMensual * Math.pow(1 + tasaMensual, n)) / (Math.pow(1 + tasaMensual, n) - 1);
    pagoMensual = Math.round(monto * factor * 100) / 100;
  }

  const comAp = Math.round(monto * (comisionApertura / 100) * 100) / 100;
  const comAd = Math.round(monto * (comisionAdmin / 100) * 100) / 100;
  const comIn = Math.round(monto * (comisionInvestigacion / 100) * 100) / 100;
  const totalComisiones = comAp + comAd + comIn;
  const ivaComisiones = Math.round(totalComisiones * 0.16 * 100) / 100;

  let saldo = monto;
  let totalIntereses = 0;
  let totalCapital = 0;
  let totalIvaInt = 0;
  const rows: AmortizacionRow[] = [];

  for (let mes = 1; mes <= n; mes++) {
    const interes = Math.round(saldo * tasaMensual * 100) / 100;
    const ivaInt = ivaIntereses ? Math.round(interes * 0.16 * 100) / 100 : 0;
    let capital: number, pago: number;

    if (mes === n) {
      capital = Math.round(saldo * 100) / 100;
      pago = Math.round((capital + interes + ivaInt + (mes === 1 ? totalComisiones + ivaComisiones : 0)) * 100) / 100;
    } else {
      capital = Math.round((pagoMensual - interes) * 100) / 100;
      pago = mes === 1
        ? Math.round((pagoMensual + ivaInt + totalComisiones + ivaComisiones) * 100) / 100
        : Math.round((pagoMensual + ivaInt) * 100) / 100;
    }

    const saldoFinal = Math.max(Math.round((saldo - capital) * 100) / 100, 0);

    rows.push({
      mes, saldoInicial: saldo, pago, interes, ivaInteres: ivaInt,
      capital, comisiones: mes === 1 ? totalComisiones : 0,
      ivaComisiones: mes === 1 ? ivaComisiones : 0, saldoFinal,
    });

    totalIntereses += interes;
    totalIvaInt += ivaInt;
    totalCapital += capital;
    saldo = saldoFinal;
  }

  return {
    rows, pagoMensual,
    totalIntereses: Math.round(totalIntereses * 100) / 100,
    totalCapital: Math.round(totalCapital * 100) / 100,
    totalIvaInt: Math.round(totalIvaInt * 100) / 100,
    totalComisiones, ivaComisiones,
    totalPagado: Math.round((totalCapital + totalIntereses + totalIvaInt + totalComisiones + ivaComisiones) * 100) / 100,
    tasaMensual: tasaAnual / 12,
  };
}

export function fmt(v: number): string {
  return "$" + Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtPct(v: number): string {
  return `${Number(v).toFixed(4)}%`;
}
