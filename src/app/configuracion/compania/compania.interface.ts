import { IAttributesTable } from "src/app/component/table/table.interface";

export interface ICompania {
  id_compania: string;
  nombre: string;
  logo: string;
  color_bg: string;
  color_fg: String;
  tipo: string;
  mail_notificacion: string;
  mail_administrador: string;
}
export interface ICompaniaTable extends IAttributesTable, ICompania {}
export type ICompanias = ICompania[];
export type ICompaniasTable = ICompaniaTable[];
