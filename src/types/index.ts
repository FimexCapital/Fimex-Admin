export interface Cliente {
  id: string;
  nombre: string;
  rfc: string;
  email: string;
  telefono: string;
  tipo: "PF" | "PFAE" | "PM";
  estatus: "activo" | "inactivo" | "prospecto";
  fechaAlta: string;
  montoCredito?: number;
  notas?: string;
}

export interface SimulacionGuardada {
  id: string;
  clienteId?: string;
  clienteNombre: string;
  monto: number;
  plazo: number;
  tasaAnual: number;
  pagoMensual: number;
  totalPagado: number;
  fecha: string;
}
