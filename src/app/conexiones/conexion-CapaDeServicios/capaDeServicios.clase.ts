export class CapaDeServicio{
    id:                number;
    id_proceso:         number
    descripcion:       String;
    url:               String;
    tipo_peticion:      String;
    estado:            String;
}

export class Proceso  {
    id:            number;
    codigo:        string;
    proceso:       string;
    frecuencia:    string;
    hora:          string;
    diasemana:     string;
    diasmes:       string;
    aplica_feriado: boolean;
    estado:        string;  
  }


