import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/authentication/login/login.service';
import { DispositivoService } from './dispositivos.service';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Dispositivos } from 'src/app/model/dispositivo';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';


@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.scss']
})
export class DispositivosComponent implements OnInit {

  listaDispositivos: Dispositivos[] = [];
  dispositivoUpdate: Dispositivos = new Dispositivos();

  tipoRegistroSeleccionado: string = null;
  isLoading = false;
  isCheckedEstado1: boolean = null;
  isCheckedEstado2: boolean = null;
  cpage = 1;
  cpageSize = 10;
  totalLengthOfCollection: number = 0;

  nombre: "";
  identificador: "";
  estado: "";
  id: "";
  isChecked: boolean = null;
  isCheckedes: boolean = null;
  currentUser: any;
  permisos: any;
  menuId: string;
  Name: string;
  btn_exportar: any;
  grd_dispositivo: any;
  btn_editar: any;
  btn_eliminar: any;
  txt_nombre_edit: any;
  cck_estado_edit: any;

  @ViewChild("myModalModificarDispositivo", { static: false }) myModalModificarDispositivo: TemplateRef<any>;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private dispositivoService: DispositivoService,
    private modalService: NgbModal,
    private authService: MsalService
  ) {

  }
  //Validar Sesion
  ngAfterViewChecked(): void {
    this.dispositivoService.isAuthenticated();
  }

  async ngOnInit() {
    try {
      this.dispositivoService.isAuthenticated();
      this.Name = this.authService.instance.getActiveAccount()?.username;
      //await this.getPermissions(); //Borar permisos al habilitar los permisos del gsa*/  this.permisos = {"codigo": "rc_plantilla","nombre": "Plantilla","visualizar": true,"nuevo": true,"modificar": true,"eliminar": true,"exportar": true,"consulta": true,"procesar": true};
      const currentUser = localStorage.getItem('currentUser');
      const authData = JSON.parse(currentUser);
      authData.permiso
      if (currentUser) {
        this.permisos = authData.permiso.find(x => x.codigo === "rc_dispositivo");
        this.btn_exportar = this.permisos.controles.find((x => x.codigo_control === "01"));
        this.grd_dispositivo = this.permisos.controles.find(x => x.codigo_control === "02");
        this.btn_editar = this.permisos.controles.find(x => x.codigo_control === "03");
        this.btn_eliminar = this.permisos.controles.find(x => x.codigo_control === "04");
        this.txt_nombre_edit = this.permisos.controles.find(x => x.codigo_control === "05");
        this.cck_estado_edit = this.permisos.controles.find(x => x.codigo_control === "06");
      }
        
      await this.consultarDispositivos();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }


  async consultarDispositivos() {
    this.isLoading = true;
    this.dispositivoService.getConsultaDispositivos().subscribe((data: any) => {
      this.listaDispositivos = data || [];
      //console.log(this.listaDispositivos);
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

  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = this.router.url.substring(1);

      this.dispositivoService.getPermissions(this.Name, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.btn_exportar = this.permisos.controles.find((x => x.codigo_control === "01"));
          //  this.menuId = data.menuId;
          //  this.plantillasService.menu(this.menuId);
          resolve();
        },
        (error) => {
          console.error('There was an error!', error);
          reject(error);
        }
      );
    });
  }

  mostrarModalModificarDispositivo(id, identificador, nombre, estado) {
    //Limpiar Para Modificar
    this.id = id;
    this.identificador = identificador;
    this.nombre = nombre;
    this.estado = estado;
    this.isLoading = true;

    if (estado == "A") {
      this.isCheckedes = true;
    } else if (estado == "I") {
      this.isCheckedes = false;
    }

    this.modalService.open(this.myModalModificarDispositivo, {

      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {
        /*this.tipoFrecuenciaSeleccionado = null;
        this.horaSeleccionada = null;
        this.horasSeleccionadas = [];
        this.valorCampoTexto = null;
        this.selectedDay = null;*/
        return true;
      },


    });
    this.isLoading = false;

  }

  ModificarDispositivo(id) {
    const nombre = (document.getElementById('nombreM') as HTMLInputElement).value;
    const identificador = (document.getElementById('identificadorM') as HTMLInputElement).value;
    const estado = (document.getElementById('estadoM') as HTMLInputElement).checked;

    if (nombre.trim() === '' || identificador.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: 'rgb(227, 199, 22)',
      })
      return;
    } else {

      if (nombre.length > 50) {
        Swal.fire({
          icon: 'warning',
          text: 'El Máximo de Caracteres es 50',
          confirmButtonColor: 'rgb(227, 199, 22)',
        })
        return;
      }

      Swal.fire({
        text: '¿Desea modificar el dispositivo?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'rgb(227, 199, 22)',
        cancelButtonColor: '#77797a',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {

          this.dispositivoUpdate.nombre = nombre;
          this.dispositivoUpdate.identificador = identificador;
          this.dispositivoUpdate.id = id;

          if (estado) {

            const checkbox = "A";
            this.dispositivoUpdate.estado = checkbox;
          } else if (!estado) {
            const checkbox = "I";
            this.dispositivoUpdate.estado = checkbox;
          }


          if (this.dispositivoUpdate.id) {
            // Si existe el ID, actualizar el registro existente
            this.dispositivoService.actualizarDispositivo(this.dispositivoUpdate).subscribe(
              (updateddispositivo) => {
                // Actualiza la lista de tipos de archivo
                const index = this.listaDispositivos.findIndex(t => t.id === updateddispositivo.id);
                if (index !== -1) {
                  this.listaDispositivos[index] = updateddispositivo;
                }
                this.consultarDispositivos().then((response) => { });
                this.modalService.dismissAll();
                Swal.fire({
                  text: 'Dispositivo Modificado.',
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

  onDelete(id: number): void {
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
        this.dispositivoService.deleteDispositivo(id).subscribe({
          next: () => {

            this.consultarDispositivos();
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

  async exportToExcelRoles(): Promise<void> {

    const dataCopy = this.listaDispositivos.map((catalogoTipoRegistro) => catalogoTipoRegistro);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dispositivos');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [
      'Id',
      'Identificador',
      'Nombre',
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
        row.id,
        row.identificador,
        row.nombre,
        row.estado
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
      column.width = headers[index] === 'Nombre Comercio' ? 40 : 20;
    });

    // Exporta el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = 'Dispositivos_' + this.parseDate(new Date(), 'MM_dd_yyyy') + '.xlsx';
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
