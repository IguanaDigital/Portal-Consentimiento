import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PlantillasService } from './plantillas.service';
import { PlantillaReybanpac, Plantillas } from '../../model/plantillas';
import Swal from 'sweetalert2';
import { saveAs } from "file-saver";
import * as ExcelJS from 'exceljs';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
@Component({
  selector: "app-catalogo-tipo-registros",
  templateUrl: "./plantillas.component.html",
  styleUrls: ["./plantillas.component.scss"],
})

export class PlantillasComponent implements OnInit {
  catalogoTipoRegistro: PlantillaReybanpac[] = [];
  selectedOption: any = null;
  opcionesTipoRegistro: any[] = [];
  opciones: any[] = [];
  cpage = 1;
  cpageSize = 25;
  accionEnCurso = false;
  isLoading = false;
  form: FormGroup;
  formedit: FormGroup;
  selectedTipoArchivo: PlantillaReybanpac;
  selectedTipoArchivoId: number = null;
  isEncriptado: boolean = null;
  private originalTipoArchivo: PlantillaReybanpac;
  permisos: any;
  btn_exportar: any;
  btn_agregar: any;
  grd_plantilla: any;
  btn_editar: any;
  btn_eliminar: any;
  pop_insertar:any;
  txt_titulo:any;
  txt_contenido:any;
  txt_contenido_video:any;
  cck_estado:any;
  btn_guardar:any;
  btn_cancelar:any;
  pop_editar:any;
  txt_titulo_edit:any;
  txt_contenido_edit:any;
  txt_contenido_video_edit:any;
  cck_estado_edit:any;
  btn_guardar_edit:any;
  btn_cancelar_edit:any;
  pop_eliminar:any;
  btn_si_elim:any;
  btn_no_elim:any;
  menuId: string;

  Name: string;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private plantillasService: PlantillasService,
    private authService: MsalService) { }



  //Validar Sesion
  ngAfterViewChecked(): void {
    this.plantillasService.isAuthenticated();
  }

  async ngOnInit() {
    try {
      this.plantillasService.isAuthenticated();
      this.Name = this.authService.instance.getActiveAccount()?.username;
      //await this.getPermissions();//Borar permisos al habilitar los permisos del gsa*/
      const currentUser = localStorage.getItem('currentUser');
      const authData = JSON.parse(currentUser);
        
      if (currentUser) {
        this.permisos =authData.permiso.find(x => x.codigo === "rc_plantilla");

          this.btn_exportar = this.permisos.controles.find(x => x.codigo_control === "01");
          this.btn_agregar = this.permisos.controles.find(x => x.codigo_control === "02");
          this.grd_plantilla = this.permisos.controles.find(x => x.codigo_control === "03");
          this.btn_editar = this.permisos.controles.find(x => x.codigo_control === "04");
          this.btn_eliminar = this.permisos.controles.find(x => x.codigo_control === "05");
          this.pop_insertar = this.permisos.controles.find(x => x.codigo_control === "06");
          this.txt_titulo = this.permisos.controles.find(x => x.codigo_control === "07");
          this.txt_contenido = this.permisos.controles.find(x => x.codigo_control === "08");
          this.txt_contenido_video = this.permisos.controles.find(x => x.codigo_control === "09");
          this.cck_estado = this.permisos.controles.find(x => x.codigo_control === "10");
          this.btn_guardar = this.permisos.controles.find(x => x.codigo_control === "11");
          this.btn_cancelar = this.permisos.controles.find(x => x.codigo_control === "12");
          this.pop_editar = this.permisos.controles.find(x => x.codigo_control === "13");
          this.txt_titulo_edit = this.permisos.controles.find(x => x.codigo_control === "14");
          this.txt_contenido_edit = this.permisos.controles.find(x => x.codigo_control === "15");
          this.txt_contenido_video_edit = this.permisos.controles.find(x => x.codigo_control === "16");
          this.cck_estado_edit = this.permisos.controles.find(x => x.codigo_control === "17");
          this.btn_guardar_edit = this.permisos.controles.find(x => x.codigo_control === "18");
          this.btn_cancelar_edit = this.permisos.controles.find(x => x.codigo_control === "19");
          this.pop_eliminar = this.permisos.controles.find(x => x.codigo_control === "20");
          this.btn_si_elim = this.permisos.controles.find(x => x.codigo_control === "21");
          this.btn_no_elim = this.permisos.controles.find(x => x.codigo_control === "22");
      }

      this.onTipoArchivoChange();
      //console.log("inicializando el form");
      //console.log(this.txt_contenido_video);

      
      this.form = this.formBuilder.group({
        titulo: [{value: '', disabled: !this.permisos?.nuevo ||!this.txt_titulo?.habilitar}, Validators.required],
        contenido_video: [{value: '', disabled: !this.txt_contenido_video?.habilitar || !this.txt_contenido_video?.modificar}, Validators.required],
        contenido: [{value: '', disabled: !this.permisos?.nuevo || !this.txt_contenido?.habilitar}, Validators.required],
        estado: [{value: '', disabled: !this.permisos?.nuevo || !this.cck_estado?.habilitar}],
      });

      this.formedit= this.formBuilder.group({
        titulo: [{value: '', disabled: !this.permisos?.modificar || !this.txt_titulo_edit?.habilitar}, Validators.required],
        contenido_video: [{value: '', disabled: !this.permisos?.modificar || !this.txt_contenido_video_edit?.habilitar}, Validators.required],
        contenido: [{value: '', disabled: !(this.permisos?.modificar) || !(this.txt_contenido_edit?.habilitar)}, Validators.required],
        estado: [{value: '', disabled: !this.permisos?.modificar ||!this.cck_estado?.habilitar}],
      });
      this.txt_contenido_video.habilitar == false ?this.form.controls.contenido_video.disabled: this.form.controls.contenido_video.enabled;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }


  // multiEmailValidator(control: AbstractControl): { [key: string]: any } | null {
  //   if (control.value) {
  //     const emails = control.value.split(',');
  //     const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  //     for (let i = 0; i < emails.length; i++) {
  //       if (emails[i] && !regex.test(emails[i].trim())) {
  //         return { 'multiEmail': true };
  //       }
  //     }
  //   }
  //   return null;
  // }

  // emailValidator(control: AbstractControl): { [key: string]: any } | null {
  //   const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  //   if (control.value && !regex.test(control.value)) {
  //     return { 'invalidEmail': true };
  //   }
  //   return null;
  // }

  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = this.router.url.substring(1);

      this.plantillasService.getPermissions(this.Name, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.btn_exportar = this.permisos.controles.find(x => x.codigo_control === "01");
          this.btn_agregar = this.permisos.controles.find(x => x.codigo_control === "02");
          this.grd_plantilla = this.permisos.controles.find(x => x.codigo_control === "03");
          this.btn_editar = this.permisos.controles.find(x => x.codigo_control === "04");
          this.btn_eliminar = this.permisos.controles.find(x => x.codigo_control === "05");
          this.pop_insertar = this.permisos.controles.find(x => x.codigo_control === "06");
          this.txt_titulo = this.permisos.controles.find(x => x.codigo_control === "07");
          this.txt_contenido = this.permisos.controles.find(x => x.codigo_control === "08");
          this.txt_contenido_video = this.permisos.controles.find(x => x.codigo_control === "09");
          this.cck_estado = this.permisos.controles.find(x => x.codigo_control === "10");
          this.btn_guardar = this.permisos.controles.find(x => x.codigo_control === "11");
          this.btn_cancelar = this.permisos.controles.find(x => x.codigo_control === "12");
          this.pop_editar = this.permisos.controles.find(x => x.codigo_control === "13");
          this.txt_titulo_edit = this.permisos.controles.find(x => x.codigo_control === "14");
          this.txt_contenido_edit = this.permisos.controles.find(x => x.codigo_control === "15");
          this.txt_contenido_video_edit = this.permisos.controles.find(x => x.codigo_control === "16");
          this.cck_estado_edit = this.permisos.controles.find(x => x.codigo_control === "17");
          this.btn_guardar_edit = this.permisos.controles.find(x => x.codigo_control === "18");
          this.btn_cancelar_edit = this.permisos.controles.find(x => x.codigo_control === "19");
          this.pop_eliminar = this.permisos.controles.find(x => x.codigo_control === "20");
          this.btn_si_elim = this.permisos.controles.find(x => x.codigo_control === "21");
          this.btn_no_elim = this.permisos.controles.find(x => x.codigo_control === "22");
          
          
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

  onTipoArchivoChange() {
    this.isLoading = true;
    console.log("empezar a la capacidad para traer todas las plantillas");
    this.plantillasService.getConsultaPlantilla().subscribe((data: any) => {
      this.catalogoTipoRegistro = data || [];
      //console.log(this.catalogoTipoRegistro);
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



  openModal(content: any) {
    //console.log(this.form);
    this.form.reset(); // Agrega esta línea para restablecer el formulario antes de abrir el modal
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {
    });
  }

  tituloExist(titulo: string, idToExclude: number = null): boolean {
    return this.catalogoTipoRegistro.some(tipoArchivo => tipoArchivo.titulo === titulo && tipoArchivo.id !== idToExclude);
  }


  onSubmit() {
    console.log("venimos aqui");
    if (this.form.valid) {
      console.log("form valid");
      const tipoArchivo = { ...this.form.value }; // Añade el tipo seleccionado al objeto tipoArchivo
      //tipoArchivo.estado = this.estadoValue || 'I';
      // Verificar si el nombre ya existe en la base de datos al agregar
      if (this.tituloExist(tipoArchivo.titulo)) {
        Swal.fire('Error', 'El titulo ingresado ya existe. Por favor, elige otro Código.', 'error');
        return; // Retorna una función vacía para evitar cerrar el modal
      }
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
          this.isLoading = true;
          tipoArchivo.estado = this.estadoValue
          //console.log(tipoArchivo);
          //console.log(this.estadoValue);
          this.plantillasService.createTipoArchivo(tipoArchivo).subscribe({
            next: (result) => {
              // Actualiza la lista de tipos de archivo y cierra el modal
              this.onTipoArchivoChange();
              this.modalService.dismissAll();
              this.form.reset(); // Limpia el formulario después de guardar
              this.isLoading = false;
              Swal.fire({
                text: 'Plantilla Creado con éxito.',
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
    else{
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: "Complete todos los campos" ,
      });
    }
  }


  onDelete(tipoArchivo: PlantillaReybanpac): void {
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
        this.plantillasService.deleteTipoArchivo(tipoArchivo.id).subscribe({
          next: () => {

            this.onTipoArchivoChange();
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

  onEdit(tipoArchivo: PlantillaReybanpac, editModal): void {
    this.selectedTipoArchivo = { ...tipoArchivo }; // Crea una copia del objeto tipoArchivo para evitar cambios en tiempo real en la tabla
    this.originalTipoArchivo = { ...tipoArchivo }; // Guarda el tipo de archivo original
    this.formedit.setValue({
      titulo: tipoArchivo.titulo,
      contenido_video: tipoArchivo.contenido_video,
      contenido: tipoArchivo.contenido,
      estado: tipoArchivo.estado === 'I' ? false : true,
    });

    this.modalService.open(editModal, { size: 'lg' });
  }

  onSave(tipoArchivo: PlantillaReybanpac): void {
    tipoArchivo.estado = this.estadoValue;
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
        this.isLoading = true;
        this.plantillasService.updateTipoArchivo(tipoArchivo).subscribe({
          next: (updatedTipoArchivo) => {
            this.onTipoArchivoChange();
            this.modalService.dismissAll(); // Cierra el modal solo si la operación fue exitosa y el nombre no está repetido
            this.isLoading = false;
            Swal.fire({
              text: 'Plantilla Modificado con éxito.',
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

  estadoValue: string = 'I';

  onEstadoChange(event: any) {
    this.isEncriptado = event.target.checked;
    this.estadoValue = this.isEncriptado ? 'A' : 'I';
  }
  onEstadoChangeEdit(estado: any) {
    this.isEncriptado = estado;
    this.estadoValue = this.isEncriptado ? 'A' : 'I';
  }

  async exportToExcel(): Promise<void> {
    const dataCopy = this.catalogoTipoRegistro.map((catalogoTipoRegistro) => catalogoTipoRegistro);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Plantillas');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [
      'Título',
      'Contenido video',
      'Contenido',
      'Estado'
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

    worksheet.columns.forEach((column, index) => {
      if (headers[index] === 'Contenido') {
        column.width = 70;
      } else if (headers[index] === 'Nombre' || headers[index] === 'Correo destinatario' || headers[index] === 'CC' || headers[index] === 'Asunto') {
        column.width = 30;
      } else {
        column.width = 20;
      }
    });


    // Agrega datos a la hoja
    dataCopy.forEach((row) => {
      const newRow = worksheet.addRow([
        row.titulo,
        row.contenido_video,
        row.contenido,
        row.estado,
      ]);

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
    this.autofitColumns(worksheet);
    // Exporta el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = 'Plantillas' + this.parseDate(new Date(), 'dd_MM_yyyy') + '.xlsx';
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
          date.replace(/-/g, "/").replace(/T/, " ").replace(/\..+/, "")
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

  autofitColumns(worksheet) {
    worksheet.columns.forEach(column => {
      let maxColumnLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        let columnLength = cell.text.length;
        if (columnLength > maxColumnLength) {
          maxColumnLength = columnLength;
        }
      });
      column.width = maxColumnLength < 10 ? 10 : maxColumnLength;
    });
  }
}
