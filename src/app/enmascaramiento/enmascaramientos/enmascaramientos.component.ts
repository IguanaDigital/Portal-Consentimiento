import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { DataService } from './enmascaramientos.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { Enmascaramiento } from "./enmascaramientos.clase";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-enmascaramientos",
  templateUrl: "./enmascaramientos.component.html",
  styleUrls: ["./enmascaramientos.component.scss"],
  providers: [DatePipe],
})

export class EnmascaramientoComponent implements OnInit {
  Enmascaramiento: Enmascaramiento = new Enmascaramiento();
  EnmascaramientoUpdate: Enmascaramiento = new Enmascaramiento();
  cpage = 1;
  cpageSize = 10;
  totalLengthOfCollection: number = 0;
  onTipoDatoSeleccionado: string = null;
  isLoading = false;
  dataEnmascaramiento: Enmascaramiento[] = [];

  isChecked: boolean = null;
  isCheckedEstado1: boolean = null;
  isCheckedEstado2: boolean = null;


  id: 0;
  nombre: "";
  longitud: 0;
  formato: "";
  tipoDeDato: "";
  estado: "";
  permisos: any;
  menuId: string;
  @ViewChild("myModalCrearEnmascaramiento", { static: false }) myModalCrearEnmascaramiento: TemplateRef<any>;
  @ViewChild("myModalUpdateEnmascaramiento", { static: false }) myModalUpdateEnmascaramiento: TemplateRef<any>;

  private subscription_obtenerDatos: Subscription;
  private subscription_crearEnmascaramiento: Subscription;
  private subscription_updateEnmascaramiento: Subscription;
  private subscription_deleteEnmascaramiento: Subscription;
  private subscription_getPermissions: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private enmascaramiento: DataService, private modalService: NgbModal) {

  }


    //Validar Sesion
    ngAfterViewChecked(): void {
      this.enmascaramiento.isAuthenticated();
    }
  
    
  async ngOnInit() {
    try {
      this.enmascaramiento.isAuthenticated();
      /*await this.getPermissions();*/ /*Borar permisos al habilitar los permisos del gsa*/  this.permisos = {"codigo": "rc_plantilla","nombre": "Plantilla","visualizar": true,"nuevo": true,"modificar": true,"eliminar": true,"exportar": true,"consulta": true,"procesar": true};
      await this.ObtieneDatosEnmascaramiento();
    } catch (error) {
      console.error('Error:', error);
    }
  }


  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      const idRol = JSON.parse(localStorage.getItem('currentUser')).rolId;
      const url = this.router.url.substring(1);

      if (this.subscription_getPermissions) {
        this.subscription_getPermissions.unsubscribe();
      }
      this.subscription_getPermissions = this.enmascaramiento.getPermissions(idRol, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.menuId = data.menuId;
          this.enmascaramiento.menu(this.menuId);
          resolve();
        },
        (error) => {
          console.error('There was an error!', error);
          reject(error);
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
    // Desuscribirse en el momento de destrucción del componente
    if (this.subscription_obtenerDatos) {
      this.subscription_obtenerDatos.unsubscribe();
    }

    if (this.subscription_crearEnmascaramiento) {
      this.subscription_crearEnmascaramiento.unsubscribe();
    }

    if (this.subscription_updateEnmascaramiento) {
      this.subscription_updateEnmascaramiento.unsubscribe();
    }

    if (this.subscription_deleteEnmascaramiento) {
      this.subscription_deleteEnmascaramiento.unsubscribe();
    }

    if (this.subscription_getPermissions) {
      this.subscription_getPermissions.unsubscribe();
    }
  }

  async ObtieneDatosEnmascaramiento() {
    this.isLoading = true;
    const consultarEnmascaramiento = () => {
      return new Promise((resolve) => {

        if (this.subscription_obtenerDatos) {
          this.subscription_obtenerDatos.unsubscribe();
        }
        this.subscription_obtenerDatos = this.enmascaramiento.obtenerDatos().subscribe(
          (response) => {
            this.dataEnmascaramiento = response;
            for (const registro of this.dataEnmascaramiento) {
              if (registro.estado == "A") {
                this.isCheckedEstado1 = true;
              } else {
                this.isCheckedEstado2 = false;
              }
            }
            this.totalLengthOfCollection = this.dataEnmascaramiento.length;
            resolve(true);
            this.isLoading = false;
          },
          error => {
            resolve(true);
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              text: error.error,
              confirmButtonColor: '#b22222',
            });
          }
        )
      })
    }
    return consultarEnmascaramiento();
  }

  onTipoDato(event: any) {
    this.onTipoDatoSeleccionado = event.target.value;
  }

  mostrarModalCrearEnmascaramiento() {

    this.modalService.open(this.myModalCrearEnmascaramiento, {

      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {
        this.onTipoDatoSeleccionado = null;
        return true;
      },

    });
    this.isLoading = false;

  }

  mostrarModalUpdateEnmascaramiento(id, nombre, longitud, formato, tipoDeDato, estado) {
    if (tipoDeDato == 'Alfanumérico') {
      this.onTipoDatoSeleccionado = tipoDeDato;
    }
    if (tipoDeDato == 'Numérico') {
      this.onTipoDatoSeleccionado = tipoDeDato;
    }

    this.id = id;
    this.nombre = nombre;
    this.longitud = longitud;
    this.formato = formato;

    if (estado == "A") {
      this.isChecked = true;
    } else if (estado == "I") {
      this.isChecked = false;
    }

    this.modalService.open(this.myModalUpdateEnmascaramiento, {

      centered: true,
      size: <any>"lg",

      scrollable: true,
      beforeDismiss: () => {
        this.onTipoDatoSeleccionado = null;
        return true;
      },

    });
    this.isLoading = false;

  }

  onSaveEnmascaramiento() {
    const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
    const longitud = (document.getElementById('longitud') as HTMLInputElement).value;
    const longitud1 = parseInt(longitud);
    const estado = (document.getElementById('estado') as HTMLInputElement).checked;
    const tipoDeDato = (document.getElementById('tipoDeDato') as HTMLInputElement).value;
    const formato = (document.getElementById('formato') as HTMLInputElement).value;


    if (nombre.trim() === '' || longitud.trim() === '' || tipoDeDato.trim() === '' || formato.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: '#b22222',
      })


    } else {

      if (formato.length > longitud1 || formato.length < longitud1) {
        Swal.fire({
          icon: 'warning',
          text: 'El Formato tiene que ser igual a la longitud ingresada',
          confirmButtonColor: '#b22222',
        })

      } else {
        Swal.fire({
          text: '¿Desea Crear el enmascaramiento?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#b22222',
          cancelButtonColor: '#77797a',
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {

            this.Enmascaramiento.nombre = nombre;
            this.Enmascaramiento.longitud = longitud1;
            this.Enmascaramiento.formato = formato;
            this.Enmascaramiento.tipoDeDato = tipoDeDato;

            if (estado) {
              const checkbox = "A";
              this.Enmascaramiento.estado = checkbox;
            } else if (!estado) {
              const checkbox = "I";
              this.Enmascaramiento.estado = checkbox;
            }


            // Crear un nuevo registro
            if (this.subscription_crearEnmascaramiento) {
              this.subscription_crearEnmascaramiento.unsubscribe();
            }
            this.subscription_crearEnmascaramiento = this.enmascaramiento.crearEnmascaramiento(this.Enmascaramiento).subscribe(
              (newTipoArchivo) => {
                // Actualiza la lista de tipos de archivo
                this.dataEnmascaramiento[0] = newTipoArchivo;
                this.actualizarTabla().then((response) => { });
                Swal.fire({
                  text: 'Enmascaramiento Creado.',
                  icon: 'success',
                  confirmButtonColor: '#b22222',
                });
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  text: error.error,
                  confirmButtonColor: '#b22222',
                });
              }
            );
            this.onTipoDatoSeleccionado = null;
            this.modalService.dismissAll();
          }
        })
      }

    }
  }

  onEditarEnmascaramiento(id) {
    const nombre = (document.getElementById('nombreM') as HTMLInputElement).value;
    const longitud = parseInt((document.getElementById('longitudM') as HTMLInputElement).value);
    const formato = (document.getElementById('formatoM') as HTMLInputElement).value;
    const estado = (document.getElementById('estadoM') as HTMLInputElement).checked;


    const longitudT = (document.getElementById('longitudM') as HTMLInputElement).value;
    const tipoDeDatoT = (document.getElementById('tipoDeDatoM') as HTMLInputElement).value;



    if (nombre.trim() === '' || longitudT.trim() === '' || tipoDeDatoT.trim() === '' || formato.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: '#b22222',
      })

    } else {

      if (longitud.toString().length > 2) {
        Swal.fire({
          icon: 'warning',
          text: 'El Maximo de Caracteres es 2',
          confirmButtonColor: '#b22222',
        })

      } else {

        if (formato.length > longitud || formato.length < longitud) {
          Swal.fire({
            icon: 'warning',
            text: 'El Formato tiene que ser igual a la longitud ingresada',
            confirmButtonColor: '#b22222',
          })

        } else {
          Swal.fire({
            text: '¿Desea modificar el enmascaramiento?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#b22222',
            cancelButtonColor: '#77797a',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
          }).then((result) => {
            if (result.isConfirmed) {

              this.EnmascaramientoUpdate.id = id;
              this.EnmascaramientoUpdate.nombre = nombre;
              this.EnmascaramientoUpdate.longitud = longitud;
              this.EnmascaramientoUpdate.formato = formato;
              this.EnmascaramientoUpdate.tipoDeDato = this.onTipoDatoSeleccionado

              if (estado) {
                const checkbox = "A";
                this.EnmascaramientoUpdate.estado = checkbox;
              } else if (!estado) {
                const checkbox = "I";
                this.EnmascaramientoUpdate.estado = checkbox;
              }

              if (this.EnmascaramientoUpdate.id) {
                // Si existe el ID, actualizar el registro existente
                if (this.subscription_updateEnmascaramiento) {
                  this.subscription_updateEnmascaramiento.unsubscribe();
                }
                this.subscription_updateEnmascaramiento = this.enmascaramiento.updateEnmascaramiento(this.EnmascaramientoUpdate).subscribe(
                  (updated) => {
                    // Actualiza la lista de tipos de archivo
                    const index = this.dataEnmascaramiento.findIndex(t => t.id === updated.id);
                    if (index !== -1) {
                      this.dataEnmascaramiento[index] = updated;
                    }
                    this.actualizarTabla().then((response) => { });
                    Swal.fire({
                      text: 'Enmascaramiento Modificado.',
                      icon: 'success',
                      confirmButtonColor: '#b22222',
                    });
                  },
                  (error) => {
                    Swal.fire({
                      icon: 'error',
                      text: error.error,
                      confirmButtonColor: '#b22222',
                    });
                  }
                );
                this.onTipoDatoSeleccionado = null;
                this.modalService.dismissAll();

              }
              this.modalService.dismissAll();

            }

          })
        }
      }
    }
  }

  onDeleteEnmascaramiento(id) {
    Swal.fire({
      text: '¿Estás seguro de que deseas eliminar el Tipo de Enmascaramiento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {

        if (this.subscription_deleteEnmascaramiento) {
          this.subscription_deleteEnmascaramiento.unsubscribe();
        }
        this.subscription_deleteEnmascaramiento = this.enmascaramiento.deleteEnmascaramiento(id).subscribe((response) => {
          this.actualizarTabla();
          Swal.fire({
            text: 'Eliminado Correctamente.',
            icon: 'success',
            confirmButtonColor: '#b22222',
          });
        },
          (error) => {
            Swal.fire({
              icon: 'error',
              text: error.error,
              confirmButtonColor: '#b22222',
            });
          });
      }
    })
  }

  async actualizarTabla() {
    const consultarEnmascaramiento = () => {
      return new Promise((resolve) => {
        if (this.subscription_obtenerDatos) {
          this.subscription_obtenerDatos.unsubscribe();
        }
        this.subscription_obtenerDatos = this.enmascaramiento.obtenerDatos().subscribe(
          (response) => {
            this.dataEnmascaramiento = response;
            for (const registro of this.dataEnmascaramiento) {
              if (registro.estado == "A") {
                this.isCheckedEstado1 = true;
              } else {
                this.isCheckedEstado2 = false;
              }
            }
            this.totalLengthOfCollection = this.dataEnmascaramiento.length;
            resolve(true)
          },
          error => {
            resolve(true);
            console.log(error);
          }
        )
      })
    }
    return consultarEnmascaramiento();
  }

  async exportToExcelEnmascaramiento(): Promise<void> {
    const dataCopy = this.dataEnmascaramiento.map((Enmascaramiento) => {
      const { id, ...rest } = Enmascaramiento;

      return {
        ...rest,
        fechaModificacion: this.formatDate(rest.fechaModificacion),
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Enmascaramiento');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [
      'Nombre',
      'Longitud',
      'Formato',
      'Fecha Modificación',
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
        row.nombre,
        row.longitud,
        row.formato,
        row.fechaModificacion,
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
    worksheet.columns.forEach((column, index) => {
      column.width = headers[index] === 'Formato' ? 50 : 20;
    });

    // Exporta el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = 'Enmascaramiento' + this.parseDate(new Date(), 'dd_MM_yyyy') + '.xlsx';
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
