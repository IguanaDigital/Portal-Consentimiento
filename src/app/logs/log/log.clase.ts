export interface FiltroType {
  origen:  Number;
  tipoEvento:  String;
  fechaInicio: String;
  fechaFin: String;
  }
  
 

export class ListadoLogs{
 
  id:                number;
  idMenu:            number;
  origen:            String;
  servicio:          String;
  tipoLogs:          String;
  tipoDeEvento:      String;
  codigo:            String;
  descripcion:       String;
  usuario:           String;
  fechaCreacion: Date;
  tipo:           String;
  }

  export class EstructuraMenu  {
    id:                  number;
    orden:               number;
    nombre:              string;
    descripcion:         string;
    tipoDeMenu:          string;
    dominio:             string;
    subDominio:          string;
    icono:               string;
    codigo:              string;
    url:                 string;
    usuarioModificacion: string;
    fechaModificacion:   Date;
    estado:              string; 
}






