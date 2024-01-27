import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { DataService } from './capaDeServicios.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { CapaDeServicio, Proceso } from "./capaDeServicios.clase";
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
@Component({
  selector: "app-capaDeServicios",
  templateUrl: "./capaDeServicios.component.html",
  styleUrls: ["./capaDeServicios.component.scss"],
  providers: [DatePipe],
})

export class CapaDeServiciosComponent implements OnInit {
  CapaDeServicio: CapaDeServicio = new CapaDeServicio();
  CapaDeS: CapaDeServicio = new CapaDeServicio();
  cpage = 1;
  cpageSize = 10;
  totalLengthOfCollection: number = 0;
  IdProcesoSeleccionado: number = null;
  tipoProcesoSeleccionado: string = null;
  isLoading = false;
  dataCapaDeServicio: CapaDeServicio[] = [];

  dataProceso: Proceso[] = [];
  ontipo_peticionSeleccionado: string = '';
  isChecked: boolean = null;
  isCheckedEstado1: boolean = null;
  isCheckedEstado2: boolean = null;

  id: 0;
  id_proceso: 0;
  descripcion: "";
  url: "";
  tipo_peticion: "";
  estado: "";
  permisos: any;
  menuId: string;
  @ViewChild("myModalCrearCapaDeServicio", { static: false }) myModalCrearCapaDeServicio: TemplateRef<any>;
  @ViewChild("myModalUpdateCapaDeServicio", { static: false }) myModalUpdateCapaDeServicio: TemplateRef<any>;
  Name: string;
  btn_exportar: any;
  btn_agregar: any;
  cmb_proceso: any;
  grd_servicio: any;
  btn_editar: any;
  btn_eliminar: any;
  pop_insertar: any;
  txt_url: any;
  txt_descripcion: any;
  cck_estado: any;
  cmb_tipo_peticion: any;
  btn_guardar: any;
  btn_cancelar: any;
  pop_editar: any;
  txt_url_edit: any;
  txt_descripcion_edit: any;
  cck_estado_edit: any;
  cmb_tipo_peticion_edit: any;
  btn_guardar_edit: any;
  btn_cancelar_edit: any;
  pop_eliminar: any;
  btn_si_elim: any;
  btn_no_elim: any;


  constructor(private router: Router, private route: ActivatedRoute, private capaDeServicio: DataService, private modalService: NgbModal, private authService: MsalService ) { }
   //
  //Validar Sesion
  ngAfterViewChecked(): void {
    this.capaDeServicio.isAuthenticated();
  }
  async ngOnInit(): Promise<void> {
    try {
      this.capaDeServicio.isAuthenticated();
      this.Name = this.authService.instance.getActiveAccount()?.username;
      //await this.getPermissions();
      const currentUser = localStorage.getItem('currentUser');
      const authData = JSON.parse(currentUser);
      if(currentUser){
        this.permisos =authData.permiso.find(x => x.codigo === "rc_servico");
        this.btn_exportar = this.permisos.controles.find((x => x.codigo_control === "01"));
        this.btn_agregar = this.permisos.controles.find((x => x.codigo_control === "02"));
        this.cmb_proceso = this.permisos.controles.find((x => x.codigo_control === "03"));
        this.grd_servicio = this.permisos.controles.find((x => x.codigo_control === "04"));
        this.btn_editar = this.permisos.controles.find((x => x.codigo_control === "05"));
        this.btn_eliminar = this.permisos.controles.find((x => x.codigo_control === "06"));
        this.pop_insertar = this.permisos.controles.find((x => x.codigo_control === "07"));
        this.txt_url = this.permisos.controles.find((x => x.codigo_control === "08"));
        this.txt_descripcion = this.permisos.controles.find((x => x.codigo_control === "09"));
        this.cck_estado = this.permisos.controles.find((x => x.codigo_control === "10"));
        this.cmb_tipo_peticion = this.permisos.controles.find((x => x.codigo_control === "11"));
        this.btn_guardar = this.permisos.controles.find((x => x.codigo_control === "12"));
        this.btn_cancelar = this.permisos.controles.find((x => x.codigo_control === "13"));
        this.pop_editar = this.permisos.controles.find((x => x.codigo_control === "14"));
        this.txt_url_edit = this.permisos.controles.find((x => x.codigo_control === "15"));
        this.txt_descripcion_edit = this.permisos.controles.find((x => x.codigo_control === "16"));
        this.cck_estado_edit = this.permisos.controles.find((x => x.codigo_control === "17"));
        this.cmb_tipo_peticion_edit = this.permisos.controles.find((x => x.codigo_control === "18"));
        this.btn_guardar_edit = this.permisos.controles.find((x => x.codigo_control === "19"));
        this.btn_cancelar_edit = this.permisos.controles.find((x => x.codigo_control === "20"));
        this.pop_eliminar = this.permisos.controles.find((x => x.codigo_control === "21"));
        this.btn_si_elim = this.permisos.controles.find((x => x.codigo_control === "22"));
        this.btn_no_elim = this.permisos.controles.find((x => x.codigo_control === "23"));
      }
      
      this.ObtieneDatosProcesos().then((response) => { });
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
  getPermissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.router.url.substring(1);

      this.capaDeServicio.getPermissions(this.Name, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.menuId = data.menuId;
          this.capaDeServicio.menu(this.menuId);
          //permisos controles
          this.btn_exportar = this.permisos.controles.find((x => x.codigo_control === "01"));
          this.btn_agregar = this.permisos.controles.find((x => x.codigo_control === "02"));
          this.cmb_proceso = this.permisos.controles.find((x => x.codigo_control === "03"));
          this.grd_servicio = this.permisos.controles.find((x => x.codigo_control === "04"));
          this.btn_editar = this.permisos.controles.find((x => x.codigo_control === "05"));
          this.btn_eliminar = this.permisos.controles.find((x => x.codigo_control === "06"));
          this.pop_insertar = this.permisos.controles.find((x => x.codigo_control === "07"));
          this.txt_url = this.permisos.controles.find((x => x.codigo_control === "08"));
          this.txt_descripcion = this.permisos.controles.find((x => x.codigo_control === "09"));
          this.cck_estado = this.permisos.controles.find((x => x.codigo_control === "10"));
          this.cmb_tipo_peticion = this.permisos.controles.find((x => x.codigo_control === "11"));
          this.btn_guardar = this.permisos.controles.find((x => x.codigo_control === "12"));
          this.btn_cancelar = this.permisos.controles.find((x => x.codigo_control === "13"));
          this.pop_editar = this.permisos.controles.find((x => x.codigo_control === "14"));
          this.txt_url_edit = this.permisos.controles.find((x => x.codigo_control === "15"));
          this.txt_descripcion_edit = this.permisos.controles.find((x => x.codigo_control === "16"));
          this.cck_estado_edit = this.permisos.controles.find((x => x.codigo_control === "17"));
          this.cmb_tipo_peticion_edit = this.permisos.controles.find((x => x.codigo_control === "18"));
          this.btn_guardar_edit = this.permisos.controles.find((x => x.codigo_control === "19"));
          this.btn_cancelar_edit = this.permisos.controles.find((x => x.codigo_control === "20"));
          this.pop_eliminar = this.permisos.controles.find((x => x.codigo_control === "21"));
          this.btn_si_elim = this.permisos.controles.find((x => x.codigo_control === "22"));
          this.btn_no_elim = this.permisos.controles.find((x => x.codigo_control === "23"));




          resolve(data); // Resuelve la Promesa cuando se obtienen los datos
        },
        (error) => {
          console.error('There was an error!', error);
          reject(error); // Rechaza la Promesa si hay un error
        }
      );
    });
  }

  onTipoPeticion(event: any) {
    this.ontipo_peticionSeleccionado = event.target.value;
  }

  onIdCapaServicioChange(event: any) {
    this.isLoading = true;
    this.IdProcesoSeleccionado = event.target.value;
    const selectedIndex = (event.target as HTMLSelectElement).options.selectedIndex;
    const selectedOption = (event.target as HTMLSelectElement).options[selectedIndex];
    this.tipoProcesoSeleccionado = selectedOption.dataset.proceso;
    this.ObtieneDatosCapaServicios().then((response) => { });
  }

  async ObtieneDatosCapaServicios() {
    this.isLoading = true;
    const consultarPermisos = () => {
      return new Promise((resolve) => {
        this.capaDeServicio.obtenerDatosCapaServicio(this.IdProcesoSeleccionado).subscribe((response) => {
          this.dataCapaDeServicio = response;
          if (response == 0) {
            Swal.fire({
              text: 'No hay Datos',
              icon: 'warning',
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
          }
          for (const registro of this.dataCapaDeServicio) {
            if (registro.estado == "A") {
              this.isCheckedEstado1 = true;
            } else {
              this.isCheckedEstado2 = false;
            }
          }
          this.totalLengthOfCollection = this.dataCapaDeServicio.length;
          resolve(true);
          this.isLoading = false;
        },
          (error) => {

            Swal.fire({
              icon: 'error',
              text: error.error,
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
            resolve(true);
          }
        )

      })
    }
    return consultarPermisos();
  }

  async ObtieneDatosProcesos() {
    const consultarProductos = () => {
      return new Promise((resolve) => {
        this.capaDeServicio.obtenerDatos().subscribe(
          (response) => {
            this.dataProceso = response;

            resolve(true);
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              text: error.error,
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
            resolve(true);

          }

        )
      })
    }
    return consultarProductos();
  }

  mostrarModalCrearCapaDeServicio() {
    this.modalService.open(this.myModalCrearCapaDeServicio, {

      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {

        return true;
      },

    });
    this.isLoading = false;

  }

  mostrarModalUpdateCapaDeServicio(id, id_proceso, descripcion, url, tipo_peticion, estado) {
    this.id = id;
    this.id_proceso = id_proceso;
    this.descripcion = descripcion;
    this.url = url;


    if (estado == "A") {
      this.isChecked = true;
    } else if (estado == "I") {
      this.isChecked = false;
    }

    if (tipo_peticion == 'GET') {
      this.ontipo_peticionSeleccionado = tipo_peticion;
    } else if (tipo_peticion == 'POST') {
      this.ontipo_peticionSeleccionado = tipo_peticion;
    }

    this.modalService.open(this.myModalUpdateCapaDeServicio, {

      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {

        return true;
      },

    });
    this.isLoading = false;

  }

  onSaveCapaDeServicio() {
    const URL = (document.getElementById('URL') as HTMLInputElement).value;
    const descripcion = (document.getElementById('descripcion') as HTMLInputElement).value;
    const estado = (document.getElementById('estado') as HTMLInputElement).checked;
    if (URL.trim() === '' || descripcion.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: 'rgb(227, 199, 22)',
      })


    } else {

      Swal.fire({
        text: '¿Desea Crear el Servicio?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'rgb(227, 199, 22)',
        cancelButtonColor: '#77797a',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {

          this.CapaDeS.id_proceso = this.IdProcesoSeleccionado;
          this.CapaDeS.url = URL;
          this.CapaDeS.descripcion = descripcion;
          this.CapaDeS.tipo_peticion = this.ontipo_peticionSeleccionado;

          if (estado) {
            const checkbox = "A";
            this.CapaDeS.estado = checkbox;
          } else if (!estado) {
            const checkbox = "I";
            this.CapaDeS.estado = checkbox;
          }



          // Crear un nuevo registro
          this.capaDeServicio.crearCapaDeServicio(this.CapaDeS).subscribe(
            (newTipoArchivo) => {
              this.modalService.dismissAll();
              this.ObtieneDatosCapaServicios().then((response) => { });
              Swal.fire({
                text: 'Capa de Servico Creada.',
                icon: 'success',
                confirmButtonColor: 'rgb(227, 199, 22)',
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                text: error.error,
                confirmButtonColor: 'rgb(227, 199, 22)',
              });
            }
          );
        }
      })
    }
  }

  onEditarCapaDeServicio(id) {
    const URL = (document.getElementById('URLM') as HTMLInputElement).value;
    const descripcion = (document.getElementById('descripcionM') as HTMLInputElement).value;
    const estado = (document.getElementById('estadoM') as HTMLInputElement).checked;
    if (URL.trim() === '' || descripcion.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: 'rgb(227, 199, 22)',
      })


    } else {
      Swal.fire({
        text: 'Desea Editar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'rgb(227, 199, 22)',
        cancelButtonColor: '#77797a',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {

          this.CapaDeServicio.id = id;
          this.CapaDeServicio.id_proceso = this.IdProcesoSeleccionado;
          this.CapaDeServicio.url = URL;
          this.CapaDeServicio.descripcion = descripcion;
          this.CapaDeServicio.tipo_peticion = this.ontipo_peticionSeleccionado;

          if (estado) {
            const checkbox = "A";
            this.CapaDeServicio.estado = checkbox;
          } else if (!estado) {
            const checkbox = "I";
            this.CapaDeServicio.estado = checkbox;
          }

          if (this.CapaDeServicio.id) {
            // Si existe el ID, actualizar el registro existente
            this.capaDeServicio.updateCapaDeServicio(this.CapaDeServicio).subscribe(
              (updated) => {
                // Actualiza la lista de tipos de archivo
                const index = this.dataCapaDeServicio.findIndex(t => t.id === updated.id);
                if (index !== -1) {
                  this.dataCapaDeServicio[index] = updated;
                }
                this.actualizarTabla(this.IdProcesoSeleccionado);
                this.modalService.dismissAll();
                Swal.fire({
                  text: 'Servicio Editado.',
                  icon: 'success',
                  confirmButtonColor: 'rgb(227, 199, 22)',
                });
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  text: error.error,
                  confirmButtonColor: 'rgb(227, 199, 22)',
                });
              }
            );
          }
        }
      })
    }
  }

  onDeleteCapaDeServicio(id) {
    Swal.fire({
      text: '¿Estás seguro de que deseas eliminar el Servicio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(227, 199, 22)',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.capaDeServicio.deleteCapaDeServicio(id).subscribe(
          (response) => {
            this.actualizarTabla(this.IdProcesoSeleccionado);
            Swal.fire({
              text: 'Eliminado Correctamente.',
              icon: 'success',
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              text: error.error,
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
          }
        );
      }
    })
  }

  async actualizarTabla(id: number) {
    const consultarPermisos = () => {
      return new Promise((resolve) => {
        this.capaDeServicio.obtenerDatosCapaServicio(id).subscribe((response) => {
          this.dataCapaDeServicio = response;
          for (const registro of this.dataCapaDeServicio) {
            if (registro.estado == "A") {
              this.isCheckedEstado1 = true;
            } else {
              this.isCheckedEstado2 = false;
            }
          }
          this.totalLengthOfCollection = this.dataCapaDeServicio.length;
          resolve(true)
        },
          (error) => {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: error.error,
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
            resolve(true)

          }
        )
      })
    }
    return consultarPermisos();
  }

  async exportToExcelCapaDeServicio(): Promise<void> {
    const dataCopy = this.dataCapaDeServicio.map((CapaDeServicio) => {
      const { id, id_proceso, ...rest } = CapaDeServicio;

      return {
        ...rest,

      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Capa_De_Servicios');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [

      'Url',
      'Descripción',
      'Tipo de petición',
      'Estado',
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
        row.url,
        row.descripcion,
        row.tipo_peticion,
        row.estado,
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
    /*  worksheet.columns.forEach((column, index) => {
       column.width = headers[index] === 'Url' ? 60 : 40 
     });*/
    worksheet.columns.forEach((column, index) => {
      if (headers[index] === 'Url') {
        column.width = 60;
      } else if (headers[index] === 'Descripción') {
        column.width = 40;
      } else if (headers[index] === 'Tipo de petición') {
        column.width = 20;
      } else if (headers[index] === 'Estado') {
        column.width = 10;
      } else {
        column.width = 100;
      }
    });

    // Exporta el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = 'CapaDeServicios_' + this.parseDate(new Date(), 'dd_MM_yyyy') + '.xlsx';
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
