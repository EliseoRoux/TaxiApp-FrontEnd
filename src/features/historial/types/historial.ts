import type { Reserva } from "../../reservas/types/reserva";
import type { Servicio } from "../../servicios/types/servicio";

export type HistorialItem =
  | (Reserva & { tipo: "reserva"; id: number; fecha: string })
  | (Servicio & { tipo: "servicio"; id: number; fecha: string });
