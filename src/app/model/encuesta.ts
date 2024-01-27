import { date } from "ngx-custom-validators/src/app/date/validator"

export interface Encuestas {
  id: number,
  id_plantilla: number,
  id_tipo_campania: number,
  nombre: string,
  habilitar_noaceptar: boolean,
  fecha_inicio: string,
  fecha_fin: string,
  estado: string
  }
  
 