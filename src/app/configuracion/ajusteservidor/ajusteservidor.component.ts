import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjusteServidorService } from './ajusteservidor.service';
import { Correo } from '../../model/correo';
import Swal from 'sweetalert2';
import { saveAs } from "file-saver";
import * as ExcelJS from 'exceljs';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: "app-catalogo-tipo-registros",
  templateUrl: "./ajusteservidor.component.html",
  styleUrls: ["./ajusteservidor.component.scss"],
})

export class AjusteServidorComponent implements OnInit {
  conexion: Correo = new Correo();
  ConeionCORREO: Correo[] = [];
  //CORREO
  CORREO: any[] = [];
  NAME: Correo[] = [];
  NAME1: any[] = [];
  REMI: Correo[] = [];
  REMI1: any[] = [];
  USER: Correo[] = [];
  USER1: any[] = [];
  SERV: Correo[] = [];
  SERV1: any[] = [];
  PORT: Correo[] = [];
  PORT1: any[] = [];
  REQ: Correo[] = [];
  REQ1: any[] = [];
  PASS: Correo[] = [];
  PASS1: any[] = [];
  requiereSSL: boolean;
  passwordValue: string;

  isLoading = false;
  showPassword: boolean = false;
  password: string;
  permisos: any;
  menuId: string;
  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private formBuilder: FormBuilder, private ajusteServidorService: AjusteServidorService) { }


    //Validar Sesion
    ngAfterViewChecked(): void {
      this.ajusteServidorService.isAuthenticated();
    }
    
  async ngOnInit() {
    try {
      this.ajusteServidorService.isAuthenticated();
      /*await this.getPermissions();*/ /*Borar permisos al habilitar los permisos del gsa*/  this.permisos = {"codigo": "rc_plantilla","nombre": "Plantilla","visualizar": true,"nuevo": true,"modificar": true,"eliminar": true,"exportar": true,"consulta": true,"procesar": true};
      await this.ObtieneDatosConexionCORREO();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
  
  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      const idRol = JSON.parse(localStorage.getItem('currentUser')).rolId;
      const url = this.router.url.substring(1);

      this.ajusteServidorService.getPermissions(idRol, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.menuId = data.menuId;
          this.ajusteServidorService.menu(this.menuId);
          resolve();
        },
        (error) => {
          console.error('There was an error!', error);
          reject(error);
        }
      );
    });
  }

  async ObtieneDatosConexionCORREO() {
    this.isLoading = true;
    const consultarProductos = () => {
      return new Promise((resolve) => {
        this.ajusteServidorService.getConfiguracionCORREO().subscribe(
          (response) => {
            this.CORREO = response;
            for (const correo of this.CORREO) {
              if (correo.modulo === "CORREO") {
                switch (correo.codigo) {
                  case "NAME":
                    this.NAME1 = correo.valor;
                    this.NAME = this.CORREO.filter(usuario => usuario.codigo === 'NAME');
                    break;
                  case "REMI":
                    this.REMI1 = correo.valor;
                    this.REMI = this.CORREO.filter(usuario => usuario.codigo === 'REMI');
                    break;
                  case "USER":
                    this.USER1 = correo.valor;
                    this.USER = this.CORREO.filter(usuario => usuario.codigo === 'USER');
                    break;
                  case "SERV":
                    this.SERV1 = correo.valor;
                    this.SERV = this.CORREO.filter(usuario => usuario.codigo === 'SERV');

                    break;
                  case "PORT":
                    this.PORT1 = correo.valor;
                    this.PORT = this.CORREO.filter(usuario => usuario.codigo === 'PORT');
                    break;
                  case "REQ":
                    this.requiereSSL = correo.valor.toLowerCase() === 'true';
                    this.REQ = this.CORREO.filter(usuario => usuario.codigo === 'REQ');
                    break;
                  case "PASS":
                    this.PASS1 = correo.valor;
                    this.passwordValue = correo.valor; // Almacena el valor de la contraseña
                    this.PASS = this.CORREO.filter(usuario => usuario.codigo === 'PASS');
                    break;
                }
              }
            }
            this.isLoading = false;
            resolve(true)
          },

          (error) => {
            console.error("Error al Guardar ", error);
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: error.error,
            });
            resolve(true);
            this.isLoading = false;
          }
        )
      })
    }
    return consultarProductos();
  }

  onUpdateConexionCORREO() {
    this.isLoading = true;
    const NAME = (document.getElementById('nombre') as HTMLInputElement).value;
    const REMI = (document.getElementById('remitente') as HTMLInputElement).value;
    const USER = (document.getElementById('usuario') as HTMLInputElement).value;
    const SERV = (document.getElementById('servidor') as HTMLInputElement).value;
    const PORT = (document.getElementById('puerto') as HTMLInputElement).value;
    const REQ = this.requiereSSL ? 'true' : 'false';
    const PASS = this.passwordValue;
    if (!NAME || !REMI || !USER || !SERV || !PORT || !PASS) {
      Swal.fire({
        icon: 'warning',
        title: 'Todos los campos deben estar llenos',
      });
      this.isLoading = false;
    }
    else {

      // Si el usuario confirma, guardar el registro
      Swal.fire({
        title: '¿Estás seguro de que deseas Guardar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#77797a',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.showPassword = !this.showPassword;
          this.password = '';
          const recordsToUpdate = [
            {
              id: this.conexion.id = this.NAME[0].id,
              codigo: this.conexion.codigo = this.NAME[0].codigo,
              nombre: this.conexion.nombre = this.NAME[0].nombre,
              valor: this.conexion.valor = NAME,
              modulo: this.conexion.modulo = this.NAME[0].modulo,
              estado: this.conexion.estado = this.NAME[0].estado
            },
            {
              id: this.conexion.id = this.REMI[0].id,
              codigo: this.conexion.codigo = this.REMI[0].codigo,
              nombre: this.conexion.nombre = this.REMI[0].nombre,
              valor: this.conexion.valor = REMI,
              modulo: this.conexion.modulo = this.REMI[0].modulo,
              estado: this.conexion.estado = this.REMI[0].estado
            },
            {
              id: this.conexion.id = this.USER[0].id,
              codigo: this.conexion.codigo = this.USER[0].codigo,
              nombre: this.conexion.nombre = this.USER[0].nombre,
              valor: this.conexion.valor = USER,
              modulo: this.conexion.modulo = this.USER[0].modulo,
              estado: this.conexion.estado = this.USER[0].estado
            },
            {
              id: this.conexion.id = this.SERV[0].id,
              codigo: this.conexion.codigo = this.SERV[0].codigo,
              nombre: this.conexion.nombre = this.SERV[0].nombre,
              valor: this.conexion.valor = SERV,
              modulo: this.conexion.modulo = this.SERV[0].modulo,
              estado: this.conexion.estado = this.SERV[0].estado
            },
            {
              id: this.conexion.id = this.PORT[0].id,
              codigo: this.conexion.codigo = this.PORT[0].codigo,
              nombre: this.conexion.nombre = this.PORT[0].nombre,
              valor: this.conexion.valor = PORT,
              modulo: this.conexion.modulo = this.PORT[0].modulo,
              estado: this.conexion.estado = this.PORT[0].estado
            },
            {
              id: this.conexion.id = this.REQ[0].id,
              codigo: this.conexion.codigo = this.REQ[0].codigo,
              nombre: this.conexion.nombre = this.REQ[0].nombre,
              valor: this.conexion.valor = REQ,
              modulo: this.conexion.modulo = this.REQ[0].modulo,
              estado: this.conexion.estado = this.REQ[0].estado
            },
            {
              id: this.conexion.id = this.PASS[0].id,
              codigo: this.conexion.codigo = this.PASS[0].codigo,
              nombre: this.conexion.nombre = this.PASS[0].nombre,
              valor: this.conexion.valor = PASS,
              modulo: this.conexion.modulo = this.PASS[0].modulo,
              estado: this.conexion.estado = this.PASS[0].estado
            },

          ];
          // Llamar al servicio para actualizar los registros
          this.ajusteServidorService.updateRecords(recordsToUpdate).subscribe(
            () => {
              this.ObtieneDatosConexionCORREO();
            },
          );
          this.isLoading = false;

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.isLoading = false;
        }
      })
    }
    this.showPassword = !this.showPassword;
  }

  async exportToExcel(): Promise<void> {


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ajuste Servidor');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [
      'Nombre',
      'Servidor',
      'Remitente',
      'Puerto',
      'Requiere SSL',
      'Usuario',
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


    const newRow = worksheet.addRow([
      this.NAME1,
      this.SERV1,
      this.REMI1,
      this.PORT1,
      this.requiereSSL ? 'Si' : 'No',
      this.USER1,
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



    // Ajusta el ancho de las columnas automáticamente según el contenido
    worksheet.columns.forEach((column, index) => {
      column.width = headers[index] === 'Servidor' ? 40 : 20;
    });

    // Exporta el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = 'Ajuste_Servidor' + this.parseDate(new Date(), 'dd_MM_yyyy') + '.xlsx';
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