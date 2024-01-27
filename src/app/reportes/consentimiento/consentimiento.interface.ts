import { IAttributesTable } from "src/app/component/table/table.interface";

export interface IConsentimiento {
  id: string;
  id_empresa: string;
  id_persona: string;
  id_encuesta: string;
  id_hacienda: string;
  empresa: string;
  hacienda: string;
  cedula: string;
  nombre: string;
  acepto: boolean;
  fecha: string;
  hora: string;
  usuario: string;
  ip: string;
  realizado: string;
  dispositivo: string;
  ubicacion: string;
  estado: string;
}
export interface IConsentimientoTable
  extends IAttributesTable,
    IConsentimiento {}

export type IConsentimientos = IConsentimiento[];
export type IConsentimientosTable = IConsentimientoTable[];
