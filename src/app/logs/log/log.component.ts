import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { saveAs } from 'file-saver';
import { DataService } from './log.service';
import { DatePipe } from '@angular/common';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import { EstructuraMenu, FiltroType, ListadoLogs } from "./log.clase";
@Component({
  selector: "app-consultas-archivos",
  templateUrl: "./log.component.html",
  styleUrls: ["./log.component.scss"],
  providers: [DatePipe],
})

export class LogsComponent implements OnInit {



  dataMenu: EstructuraMenu[] = [];

  isLoading = false;
  isSearchDisabled: boolean = true;
  dataLogs: ListadoLogs[] = [];
  filteredCuentas: any[] = [];
  onTipoMenuSeleccionado: number = -1;
  onTipoEventoSeleccionado: String = null;

  columnSearchTerm = this.clearColumnSearchTerm();
  isChecked: boolean = null;
  cpage = 1;
  cpageSize = 10;
  totalLengthOfCollection: number = 0;
  permisos: any;
  filtroDto: FiltroType = {
    origen: new Number(),
    tipoEvento: new String(),
    fechaInicio: new String(),
    fechaFin: new String(),
  };
  menuId: string;

  onSearch(event: any, key: string) {
    let value =
      event.target.type !== "date"
        ? event.target.value
        : this.parseDate(event.target.value, "MM/dd/yyyy");
    this.columnSearchTerm[key] = value;
    this.columnsSearch();
  }


  constructor(private route: ActivatedRoute, private log: DataService, private router: Router,) {
  }

 //Validar Sesion
 ngAfterViewChecked(): void {
  this.log.isAuthenticated();
}

  async ngOnInit() {
    try {
      this.log.isAuthenticated();
      /*await this.getPermissions();*/ /*Borar permisos al habilitar los permisos del gsa*/  this.permisos = {"codigo": "rc_plantilla","nombre": "Plantilla","visualizar": true,"nuevo": true,"modificar": true,"eliminar": true,"exportar": true,"consulta": true,"procesar": true};
      await this.ObtieneTipoDominio();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  

  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      const idRol = JSON.parse(localStorage.getItem('currentUser')).rolId;
      const url = this.router.url.substring(1);

      this.log.getPermissions(idRol, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.menuId = data.menuId;
          this.log.menu(this.menuId);
          resolve();
        },
        (error) => {
          console.error('There was an error!', error);
          reject(error);
        }
      );
    });
  }

  async ObtieneTipoDominio() {
    const consultarEstructura = () => {
      return new Promise((resolve) => {
        this.log.obtenerDatos("Menu").subscribe(
          (response) => {
            this.dataMenu = response.filter(item => item.estado == 'A');
            resolve(true);
          },
          error => {
            resolve(true);
            Swal.fire({
              icon: 'error',
              text: error.error,
            });
          }
        )
      })
    }
    return consultarEstructura();
  }

  onTipoMenu(event: any) {
    this.onTipoMenuSeleccionado = event.target.value;
    this.isSearchDisabled =
      !this.filtroDto.fechaInicio.toString() ||
        !this.filtroDto.fechaFin.toString() ||
        !this.onTipoMenuSeleccionado ||
        !this.onTipoEventoSeleccionado
        ? true
        : false;
  }

  nonNullValues(obj: object): object {
    let result = {};
    for (let key in obj) {
      if (obj[key]) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  columnsSearch() {
    const query = this.nonNullValues(this.columnSearchTerm);
    this.filteredCuentas = [...this.dataLogs];
    this.filteredCuentas = this.filteredCuentas.filter((record) => {
      let result = true;
      for (const [key, value] of Object.entries(query)) {
        let cellValue =
          typeof record[key] !== "number"
            ? key.indexOf("fecha") > -1
              ? this.formatDate(record[key]).split(' ')[0]
              : record[key]
            : record[key].toString();
        if (
          !cellValue ||
          (cellValue &&
            cellValue.toLowerCase().indexOf(value.toLowerCase()) === -1)
        ) {
          result = false;
          break;
        }
      }
      return result;
    });
  }

  private clearColumnSearchTerm() {
    return {
      id: 0,
      idMenu: 0,
      origen: '',
      servicio: '',
      tipoLogs: '',
      tipoDeEvento: '',
      codigo: '',
      descripcion: '',
      usuario: '',
      fechaCreacion: '',
      tipo: '',

    };
  }

  onDateChange(event: any, key: string) {
    const dateValue = event.target.value;
    const formattedDate = this.formatDate(dateValue).split(' ')[0];
    const formattedEvent = { ...event, target: { ...event.target, value: formattedDate } };
    this.onSearch(formattedEvent, key);
  }

  onTipoEvento(event: any) {
    this.onTipoEventoSeleccionado = event.target.value;
    this.isSearchDisabled =
      !this.filtroDto.fechaInicio.toString() ||
        !this.filtroDto.fechaFin.toString() ||
        !this.onTipoMenuSeleccionado ||
        !this.onTipoEventoSeleccionado
        ? true
        : false;
  }

  async ObtieneDatosLogs() {
    this.isLoading = true;
    const consultarLogs = () => {
      return new Promise((resolve) => {

        this.filtroDto.origen = this.onTipoMenuSeleccionado;
        this.filtroDto.tipoEvento = this.onTipoEventoSeleccionado;
        if (this.filtroDto.origen == -1) {
          Swal.fire({
            text: 'Ingrese Origen',
            icon: 'warning',
            confirmButtonColor: '#b22222',
          });
        } else if (this.filtroDto.tipoEvento == null) {
          Swal.fire({
            text: 'Ingrese Tipo de Evento',
            icon: 'warning',
            confirmButtonColor: '#b22222',
          });
        }
        if (this.isChecked) {
          this.log.consultaFiltroHistorico(this.filtroDto).subscribe(

            (listLogs) => {
              this.dataLogs = listLogs;
              this.filteredCuentas = [...this.dataLogs];
              this.columnSearchTerm = this.clearColumnSearchTerm();

              this.isLoading = false;
              resolve(true);


            },
            (error) => {
              resolve(true)
              Swal.fire({
                icon: 'error',
                text: error.error,
                confirmButtonColor: '#b22222',
              });
              this.isLoading = false;
            }
          );

        } else {
          this.log.consultaFiltroLogs(this.filtroDto).subscribe(

            (listLogs) => {
              this.dataLogs = listLogs;
              this.filteredCuentas = [...this.dataLogs];
              this.columnSearchTerm = this.clearColumnSearchTerm();

              this.isLoading = false;
              resolve(true);


            },
            (error) => {
              resolve(true)
              Swal.fire({
                icon: 'error',
                text: error.error,
                confirmButtonColor: '#b22222',
              });
              this.isLoading = false;
            }
          );

        }

      })
    }
    return consultarLogs();
  }



  onConsultarLogs() {
    this.isLoading = true;
    this.ObtieneDatosLogs().then((response) => { });
  }

  onFechaDesdeChange(event: any) {
    if (typeof event === 'object' && event instanceof Event) {
      return;
    }
    const fechaDesde = event;

    // Validar si la fecha es válida antes de cambiar fechaInicio
    if (fechaDesde) {
      this.filtroDto.fechaInicio = new String(fechaDesde);
      const fechaDesdeDate = new Date(fechaDesde.replace(/-/g, "/").replace(/T.+/, ""));
      const currentDate = new Date();

      if (fechaDesdeDate > currentDate) {
        Swal.fire({
          text: 'Fecha desde no debe ser mayor a la fecha actual',
          icon: 'error',
          confirmButtonColor: '#b22222',
        }).then((result) => {
          this.filtroDto.fechaInicio = new String();
          this.filtroDto.fechaFin = new String();
          this.toggleSearch();
          if (result.isConfirmed) {
          }
        });
      } else {
        let fechaHasta = new Date(fechaDesde.replace(/-/g, "/").replace(/T.+/, ""));

        // Si la fecha desde es ayer, la fecha hasta debe ser hoy
        if ((currentDate.getTime() - fechaDesdeDate.getTime()) === (24 * 60 * 60 * 1000)) {
          fechaHasta = currentDate;
        } else {
          fechaHasta.setMonth(fechaDesdeDate.getMonth() + 3);
          // Si la fecha hasta es mayor a la fecha actual, se establece como la fecha actual
          if (fechaHasta > currentDate) {
            fechaHasta = currentDate;
          }
        }

        // Cambiamos el formato a 'MM-DD-YYYY'.
        const formattedDate = ('0' + (fechaHasta.getMonth() + 1)).slice(-2) + '-' + ('0' + fechaHasta.getDate()).slice(-2) + '-' + fechaHasta.getFullYear();

        this.filtroDto.fechaFin = formattedDate;
      }
      this.toggleSearch();
    }
  }

  isValidDate(d: any) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  private toggleSearch() {
    this.isSearchDisabled =
      !this.filtroDto.fechaInicio.toString() ||
        !this.filtroDto.fechaFin.toString() ||
        !this.onTipoMenuSeleccionado ||
        !this.onTipoEventoSeleccionado
        ? true
        : false;
  }

  onFechaHastaChange(event: any) {
    if (typeof event === 'object' && event instanceof Event) {
      this.toggleSearch();
      return;
    }
    const fechaHasta = event;
    this.filtroDto.fechaFin = new String(fechaHasta);
    if (
      new Date(fechaHasta.replace(/-/g, "/").replace(/T.+/, "")) > new Date()
    ) {
      Swal.fire({
        text: 'Fecha hasta no debe ser mayor a la fecha actual',
        icon: 'error',
        confirmButtonColor: '#b22222',
      }).then((result) => {
        this.filtroDto.fechaFin = new String();
        this.toggleSearch();
        if (result.isConfirmed) {
        }
      });
    }
    else if (
      new Date(fechaHasta.replace(/-/g, "/").replace(/T.+/, "")) <
      new Date(this.filtroDto.fechaInicio.replace(/-/g, "/").replace(/T.+/, ""))
    ) {
      Swal.fire({
        text: 'Fecha hasta no debe ser menor a la Fecha Desde',
        icon: 'error',
        confirmButtonColor: '#b22222',
      }).then((result) => {
        this.filtroDto.fechaFin = new String();
        this.toggleSearch();
        if (result.isConfirmed) {
        }
      });
    }
    else if ( (
      new Date(fechaHasta.replace(/-/g, "/").replace(/T.+/, "")).getTime() -
      new Date(this.filtroDto.fechaInicio.replace(/-/g, "/").replace(/T.+/, "")).getTime() ) / (1000 * 3600 * 24)> 90
    ) {
      Swal.fire({
        text: 'Fecha hasta no debe ser mayor a 90 dias',
        icon: 'error',
        confirmButtonColor: '#b22222',
      }).then((result) => {
        this.filtroDto.fechaFin = new String();
        this.toggleSearch();
        if (result.isConfirmed) {
        }
      });
    }

    if (!this.filtroDto.fechaInicio.toString()) {
      this.filtroDto.fechaInicio = this.filtroDto.fechaFin;
    }
    this.toggleSearch();
  }

  async exportToExcelLogs(): Promise<void> {
    const dataCopy = this.dataLogs.map((usuario) => {
      const { id, idMenu, ...rest } = usuario;

      return {
        ...rest,
        fechaModificacion: this.formatDate(rest.fechaCreacion),
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Logs');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [
      'Origen',
      'Servicio',
      'COT',
      'Tipo de Evento',
      'Código',
      'Descripción',
      'Usuario',
      'Fecha Modificación',
    ];
    const headerRow = worksheet.addRow(headers);

    // Aplica estilos al encabezado
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'rgb(227, 199, 22)' }, // Color negro
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // Letra blanca
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true, // Ajusta el texto si es necesario
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega datos a la hoja
    dataCopy.forEach((row) => {
      const newRow = worksheet.addRow([
        row.origen,
        row.servicio,
        row.tipoLogs,
        row.tipoDeEvento,
        row.codigo,
        row.descripcion,
        row.usuario,
        row.fechaCreacion,
      ]);


      // Aplica estilos a las celdas de contenido
      newRow.eachCell((cell, colNumber) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };


      });

    });

    // Ajusta el ancho de las columnas automáticamente según el contenido
    worksheet.columns.forEach((column, index) => {
      column.width = headers[index] === 'Descripción' ? 60 : 30;
    });

    // Exporta el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = 'Logs_' + this.parseDate(new Date(), 'dd_MM_yyyy') + '.xlsx';
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
  }

  formatDate(dateInput: string | Date): string {
    const date = new Date(dateInput);

    if (isNaN(date.getTime()) || date.getFullYear() === 1969) {
      // Si la fecha no es válida o el año es 1969, devuelve una cadena vacía
      return '';
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  }

  parseDate(date: string | number | Date, format: string): string {
    let newDate =
      typeof date === "string"
        ? new Date(
          date.replace(/-/g, "-").replace(/T/, " ").replace(/\..+/, "")
        )
        : new Date(date);
    if (!date || isNaN(newDate.getTime())) {
      return "";
    }
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getUTCDate();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    const seconds = newDate.getSeconds();

    let parsedDate = format;

    parsedDate = parsedDate.replace("yyyy", year.toString());
    parsedDate = parsedDate.replace("MM", month.toString().padStart(2, "0"));
    parsedDate = parsedDate.replace("dd", day.toString().padStart(2, "0"));
    parsedDate = parsedDate.replace("HH", hours.toString().padStart(2, "0"));
    parsedDate = parsedDate.replace("mm", minutes.toString().padStart(2, "0"));
    parsedDate = parsedDate.replace("ss", seconds.toString().padStart(2, "0"));

    return parsedDate;
  }

}
