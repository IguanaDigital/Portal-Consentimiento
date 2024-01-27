
import { Component, OnInit, ViewChild, TemplateRef, HostListener, QueryList, ViewChildren, Directive } from "@angular/core";
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from './permisos.service';
import { Permisos } from "./permisos.clase";
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Encuestas } from "src/app/model/encuesta";
import { EncuestaService } from "src/app/configuracion/encuesta/encuesta.service";
import { Dispositivos } from "src/app/model/dispositivo";
import { DispositivoService } from "src/app/configuracion/dispositivos/dispositivos.service";
import { PermisoDispositivo, PermisoTabla } from "src/app/model/permisoDispositivo";
import { FormGroup } from "@angular/forms";
import { Zona } from "src/app/model/zona";
import { ZonaService } from "./zona.service";
import { Hacienda } from "src/app/model/hacienda";
import { HaciendaService } from "./hacienda.service";
import { MsalService} from '@azure/msal-angular';
import { name } from "@azure/msal-angular/packageMetadata";

@Component({
  selector: "app-permisos",
  templateUrl: "./permisos.component.html",
  styleUrls: ["./permisos.component.scss"],
})



export class PermisosComponent implements OnInit {
  permiso: Permisos = new Permisos();

  dataPermisos: Permisos[] = [];
  dataEncuesta: Encuestas[] = [];
  dataDispositivo: Dispositivos[] = [];
  dataZona: Zona[] = [];
  dataHacienda: Hacienda[] = [];
  dataPermisoTabla: PermisoTabla[] = [];

  Name: string;
  isLoading = false;
  idEncuestaSeleccionada: number = 0;
  nombreEncuestaSeleccionada: string;
  identificadorDispositivo: string;
  id_dispositivo: number = 0;
  nombreDispositivoSeleccionado: string;
  form: FormGroup;

  IdRolSeleccionado: number = null;

  passwordValue: string;
  permisos: any;
  menuId: string;

  idZonaSeleccionada: number = 0;
  idHaciendaSeleccionada: number = 0;
  estado_permiso = true;

  permisoSeleccionado: PermisoTabla;
  btn_exportar: any;
  btn_agregar: any;
  cmb_encuesta: any;
  cmb_dispositivo: any;
  grd_permiso: any;
  btn_editar: any;
  btn_eliminar: any;
  pop_insertar: any;
  cmb_zona: any;
  cmb_hacienda: any;
  cck_estado: any;
  btn_guardar: any;
  btn_cancelar: any;
  pop_editar: any;
  cmb_zona_edit: any;
  cmb_hacienda_edit: any;
  cck_estado_edit: any;
  btn_guardar_edit: any;
  btn_cancelar_edit: any;
  pop_eliminar: any;
  btn_si_elim: any;
  btn_no_elim: any;


  constructor(private router: Router, private route: ActivatedRoute, private Permiso: DataService, private encuestaService: EncuestaService, private dispositivoService: DispositivoService, private modalService: NgbModal, private zonaService: ZonaService, private haciendaService: HaciendaService,     private authService: MsalService,) {

    this.consultarEncuestas();
  }
  //Validar Sesion
  ngAfterViewChecked(): void {
    this.Permiso.isAuthenticated();
  }

  async ngOnInit() {
    try {
      //this.Permiso.isAuthenticated();
      this.Name = this.authService.instance.getActiveAccount()?.username;
     // await this.getPermissions(); 
     
     const currentUser = localStorage.getItem('currentUser');
     const authData = JSON.parse(currentUser);
     if(currentUser){
      this.permisos =authData.permiso.find(x => x.codigo === "rc_permiso");
      this.btn_exportar = this.permisos.controles.find((x=> x.codigo_control === "01"));
      this.btn_agregar = this.permisos.controles.find((x=> x.codigo_control === "02"));
      this.cmb_encuesta = this.permisos.controles.find((x=> x.codigo_control === "03"));
      this.cmb_dispositivo = this.permisos.controles.find((x=> x.codigo_control === "04"));
      this.grd_permiso = this.permisos.controles.find((x=> x.codigo_control === "05"));
      this.btn_editar = this.permisos.controles.find((x=> x.codigo_control === "06"));
      this.btn_eliminar = this.permisos.controles.find((x=> x.codigo_control === "07"));
      this.pop_insertar = this.permisos.controles.find((x=> x.codigo_control === "08"));
      this.cmb_zona = this.permisos.controles.find((x=> x.codigo_control === "09"));
      this.cmb_hacienda = this.permisos.controles.find((x=> x.codigo_control === "10"));
      this.cck_estado = this.permisos.controles.find((x=> x.codigo_control === "12"));
      this.btn_guardar = this.permisos.controles.find((x=> x.codigo_control === "13"));
      this.btn_cancelar = this.permisos.controles.find((x=> x.codigo_control === "14"));
      this.pop_editar = this.permisos.controles.find((x=> x.codigo_control === "15"));
      this.cmb_zona_edit = this.permisos.controles.find((x=> x.codigo_control === "16"));
      this.cmb_hacienda_edit = this.permisos.controles.find((x=> x.codigo_control === "17"));
      this.cck_estado_edit = this.permisos.controles.find((x=> x.codigo_control === "18"));
      this.btn_guardar_edit = this.permisos.controles.find((x=> x.codigo_control === "19"));
      this.btn_cancelar_edit = this.permisos.controles.find((x=> x.codigo_control === "20"));
      this.pop_eliminar = this.permisos.controles.find((x=> x.codigo_control === "21"));
      this.btn_si_elim = this.permisos.controles.find((x=> x.codigo_control === "23"));
      this.btn_no_elim = this.permisos.controles.find((x=> x.codigo_control === "24"));
     }
      this.consultarEncuestas();
      this.consultarZonas();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  onSubmit() {
    console.log("agregar permiso");
    if (this.idZonaSeleccionada != 0 && this.idHaciendaSeleccionada != 0) {
      let permiso: PermisoDispositivo = {
        id: 0,
        id_hacienda: this.idHaciendaSeleccionada.toString(),
        id_dispositivo: this.id_dispositivo,
        id_encuesta: this.idEncuestaSeleccionada,
        estado: this.estado_permiso == true ? 'A' : 'I'
      };
      this.isLoading = true;
      this.dispositivoService.createPermiso(permiso).subscribe({
        next: (result) => {
          // Actualiza la lista de tipos de archivo y cierra el modal

          this.consultarPermisonEncuestaDispositivo(this.idEncuestaSeleccionada, this.id_dispositivo);
          this.modalService.dismissAll();
          this.isLoading = false;
          Swal.fire({
            text: 'Permiso Creado con éxito.',
            icon: 'success',
            confirmButtonColor: 'rgb(227, 199, 22)',
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: error.error,
          });
          this.isLoading = false;
        },
      });
    } else {
      Swal.fire({
        text: 'Seleccione zona y hacienda',
        icon: 'warning',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });
    }
  }

  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
    //  const idRol = JSON.parse(localStorage.getItem('currentUser')).rolId;
      const url = this.router.url.substring(1);

      this.Permiso.getPermissions(this.Name, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.btn_exportar = this.permisos.controles.find((x=> x.codigo_control === "01"));
          this.btn_agregar = this.permisos.controles.find((x=> x.codigo_control === "02"));
          this.cmb_encuesta = this.permisos.controles.find((x=> x.codigo_control === "03"));
          this.cmb_dispositivo = this.permisos.controles.find((x=> x.codigo_control === "04"));
          this.grd_permiso = this.permisos.controles.find((x=> x.codigo_control === "05"));
          this.btn_editar = this.permisos.controles.find((x=> x.codigo_control === "06"));
          this.btn_eliminar = this.permisos.controles.find((x=> x.codigo_control === "07"));
          this.pop_insertar = this.permisos.controles.find((x=> x.codigo_control === "08"));
          this.cmb_zona = this.permisos.controles.find((x=> x.codigo_control === "09"));
          this.cmb_hacienda = this.permisos.controles.find((x=> x.codigo_control === "10"));
          this.cck_estado = this.permisos.controles.find((x=> x.codigo_control === "12"));
          this.btn_guardar = this.permisos.controles.find((x=> x.codigo_control === "13"));
          this.btn_cancelar = this.permisos.controles.find((x=> x.codigo_control === "14"));
          this.pop_editar = this.permisos.controles.find((x=> x.codigo_control === "15"));
          this.cmb_zona_edit = this.permisos.controles.find((x=> x.codigo_control === "16"));
          this.cmb_hacienda_edit = this.permisos.controles.find((x=> x.codigo_control === "17"));
          this.cck_estado_edit = this.permisos.controles.find((x=> x.codigo_control === "18"));
          this.btn_guardar_edit = this.permisos.controles.find((x=> x.codigo_control === "19"));
          this.btn_cancelar_edit = this.permisos.controles.find((x=> x.codigo_control === "20"));
          this.pop_eliminar = this.permisos.controles.find((x=> x.codigo_control === "21"));
          this.btn_si_elim = this.permisos.controles.find((x=> x.codigo_control === "23"));
          this.btn_no_elim = this.permisos.controles.find((x=> x.codigo_control === "24"));
        
          this.Permiso.menu(this.menuId);
          resolve();
        },
        (error) => {
          console.error('There was an error!', error);
          reject(error);
        }
      );
    });
  }

  async ObtieneDatosPermisos() {
    this.isLoading = true;
    const consultarPermisos = () => {
      return new Promise((resolve) => {
        this.Permiso.obtenerDatosPermisos(this.IdRolSeleccionado).subscribe((response) => {
          this.dataPermisos = response;
          //* console.log(this.dataPermisos);       
          if (response == 0) {
            Swal.fire({
              text: 'No hay Datos',
              icon: 'warning',
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
          }
          resolve(true);
          this.isLoading = false;
        },
          error => {
            resolve(true);
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              text: error.error,
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
          }
        )
      })
    }
    return consultarPermisos();
  }

  consultarEncuestas() {
    this.isLoading = true;
    this.encuestaService.getConsultaEncuesta().subscribe((data: any) => {
      this.dataEncuesta = data || [];
      //console.log(this.dataEncuesta);
      this.isLoading = false;
      console.log("consultando encuestas");
    },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: error.error,
        });
        this.isLoading = false;
      }
    );
  }

  consultaDispositivoPorEncuesta(encuesta_id: number) {
    this.dataDispositivo = [];
    this.isLoading = true;
    this.dispositivoService.getConsultaDispositivosPorEncuesta(encuesta_id).subscribe((data: any) => {
      this.dataDispositivo = data || [];
      this.isLoading = false;
    },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: error.error,
        });
        this.isLoading = false;
      }
    );
  }

  consultarPermisonEncuestaDispositivo(encuesta_id: number, dispositivo_id: number) {
    this.isLoading = true;
    this.dispositivoService.consultaPermisosEncuestaDispositivo(encuesta_id, dispositivo_id).subscribe((data: any) => {
      this.dataPermisoTabla = data || [];
      this.isLoading = false;
    },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: error.error,
        });
        this.isLoading = false;
      }
    );
  }

  consultarZonas() {
    console.log("tratando de obtener zonas");
    this.isLoading = true;
    this.zonaService.consultarZona().subscribe((data: any) => {
      this.dataZona = data || [];
      //console.log(this.dataZona);
      this.isLoading = false;
    },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: error.error,
        });
        this.isLoading = false;
      }
    );
  }

  consultarHaciendasPorZona(Zona_id: number) {
    console.log("tratando de obtener haciendas");
    this.isLoading = true;
    this.haciendaService.consultarHaciendaZonaId(Zona_id).subscribe((data: any) => {
      this.dataHacienda = data || [];
      //console.log(this.dataHacienda);
      this.isLoading = false;
    },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: error.error,
        });
        this.isLoading = false;
      }
    );
  }

  getHaciendasPorZona(Zona_id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.haciendaService.consultarHaciendaZonaId(Zona_id).subscribe(
        (data: any) => {
          this.dataHacienda = data || [];
          //console.log(this.dataHacienda);
          resolve(true);
        },
        (error) => {
          console.error('There was an error!', error);
          resolve(false);
        }
      );
    });
  }

  onChangeEncuesta(event: any) {
    this.idEncuestaSeleccionada = event.target.value;
    const id = Number(event.target.value);
    //console.log(event.target.value);
    const objetoEncontrado = this.dataEncuesta.find(item => item.id === id);
    //console.log(this.dataEncuesta);
    //console.log(objetoEncontrado);
    this.nombreEncuestaSeleccionada = objetoEncontrado.nombre;
    this.consultaDispositivoPorEncuesta(this.idEncuestaSeleccionada);
    //this.ObtieneDatosPermisos().then((response) => {})
  }

  onChangeDispositivo(event: any) {
    this.id_dispositivo = event.target.value;
    const id = Number(event.target.value);
    const objetoEncontrado = this.dataDispositivo.find(item => item.id === id);
    this.identificadorDispositivo = objetoEncontrado.identificador;
    this.nombreDispositivoSeleccionado = objetoEncontrado.nombre;
    this.consultarPermisonEncuestaDispositivo(this.idEncuestaSeleccionada, this.id_dispositivo);
  }

  onChangeZona(event: any) {
    this.idZonaSeleccionada = event.target.value;
    this.consultarHaciendasPorZona(this.idZonaSeleccionada);
  }

  onChangeHacienda(event: any) {
    this.idHaciendaSeleccionada = event.target.value;
  }

  guardarValoresSeleccionados() {
    Swal.fire({
      text: '¿Desea Guardar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'rgb(227, 199, 22)',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Permiso.updateRecords(this.dataPermisos).subscribe(
          () => {

            this.ObtieneDatosPermisos().then((response) => { });
            Swal.fire({
              text: 'Guardado Correctamente.',
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

  openModal(content: any) {
    console.log(this.form);
    this.idZonaSeleccionada = 0;
    this.idHaciendaSeleccionada = 0;
    this.estado_permiso=true;
    //this.form.reset(); // Agrega esta línea para restablecer el formulario antes de abrir el modal
    //this.reiniciarValores();
    if (this.idEncuestaSeleccionada != 0 && this.id_dispositivo != 0) {

      this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      }, (reason) => {
      });
    } else {

      Swal.fire({
        text: 'Seleccione encuesta y dispositivo',
        icon: 'warning',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });
    }
  }

  onDelete(tipoArchivo: PermisoTabla): void {
    // Agrega la confirmación aquí
    Swal.fire({
      title: '¿Estás seguro de que deseas Eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(227, 199, 22)',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.dispositivoService.deleteDispositivoPermiso(tipoArchivo.id).subscribe({
          next: () => {

            this.consultarPermisonEncuestaDispositivo(this.idEncuestaSeleccionada, this.id_dispositivo);
            this.isLoading = false;
            Swal.fire({
              text: 'Eliminado Correctamente.',
              icon: 'success',
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: error.error,
            });
            this.isLoading = false;
          },
        });
      }
    });
  }


  onEdit(tipoArchivo: PermisoTabla, editModal): void {
    this.permisoSeleccionado = tipoArchivo
    this.isLoading = true;
    this.getHaciendasPorZona(Number(this.permisoSeleccionado.id_zona))
      .then((resultado) => {
        if (resultado) {
          this.idZonaSeleccionada = Number(this.permisoSeleccionado.id_zona);
          this.idHaciendaSeleccionada = Number(this.permisoSeleccionado.id_hacienda);
          this.estado_permiso = tipoArchivo.estado === 'A' ? true : false;
          this.isLoading = false;
          this.modalService.open(editModal, { size: 'lg' });
        } else {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: "Error al obtener haciendas",
          });
          this.isLoading = false;
          // Realiza acciones adicionales si la operación falló
        }
      });
  }


  onSave(): void {
    this.permisoSeleccionado.estado = this.estado_permiso==true?'A':'I';
    Swal.fire({
      title: '¿Estás seguro de que deseas Guardar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(227, 199, 22)',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let permiso: PermisoDispositivo = {
          id: this.permisoSeleccionado.id,
          id_hacienda: this.idHaciendaSeleccionada.toString(),
          id_dispositivo: this.permisoSeleccionado.id_dispositivo,
          id_encuesta: this.permisoSeleccionado.id_encuesta,
          estado: this.estado_permiso == true ? 'A' : 'I'
        };
        this.isLoading = true;
        this.dispositivoService.actualizarPermiso(permiso).subscribe({
          next: (result) => {
            // Actualiza la lista de tipos de archivo y cierra el modal
  
            this.consultarPermisonEncuestaDispositivo(this.idEncuestaSeleccionada, this.id_dispositivo);
            this.modalService.dismissAll();
            this.isLoading = false;
            Swal.fire({
              text: 'Permiso actualizado con éxito.',
              icon: 'success',
              confirmButtonColor: 'rgb(227, 199, 22)',
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: error.error,
            });
            this.isLoading = false;
          },
        });
      }
    });
  }
  async exportToExcelPermisos(): Promise<void> {
    const dataCopy = this.dataPermisoTabla.map((Permisos) => {
      const { ...rest } = Permisos;

      return {
        ...rest,

      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Permisos');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [
      'Dispositivo',
      'Identificador',
      'Encuesta',
      'Zona',
      'Hacienda',
      'Estado',
    ];
    const headerRow = worksheet.addRow(headers);

    // Aplica estilos al encabezado
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'rgb(227, 199, 22)' }, // Color rojo
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
        row.dispositivo,
        row.identificador,
        row.encuesta,
        row.zona,
        row.hacienda,
        row.estado,
      ]);


      // Aplica estilos a las celdas de contenido
      newRow.eachCell((cell, colNumber) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
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
      column.width = headers[index] === 'Correo' ? 40 : 20;
    });

    // Exporta el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = 'Permisos_' + this.parseDate(new Date(), 'dd_MM_yyyy') + '.xlsx';
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
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

}
