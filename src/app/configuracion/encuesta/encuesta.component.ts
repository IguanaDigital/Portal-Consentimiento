import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantillaReybanpac, Plantillas } from 'src/app/model/plantillas';
import { EncuestaService } from './encuesta.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import { Encuestas } from 'src/app/model/encuesta';
import { PlantillasService } from '../plantillasComponent/plantillas.service';
import { TipoCampaniaService } from './tipoCampania.service';
import { TipoCampania } from 'src/app/model/tipoCampania';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent implements OnInit {

  catalogoTipoRegistro: Encuestas[] = [];
  catalogoPlantillas: PlantillaReybanpac[] = [];
  catalogoCampanias: TipoCampania[] = [];
  selectedOption: any = null;
  opcionesTipoRegistro: any[] = [];
  opciones: any[] = [];
  cpage = 1;
  cpageSize = 25;
  accionEnCurso = false;
  isLoading = false;
  form: FormGroup;
  selectedTipoArchivo: Encuestas;
  selectedTipoArchivoId: number = null;
  isEncriptado: boolean = null;
  private originalTipoArchivo: Encuestas;
  permisos: any;
  menuId: string;
  btn_exportar: any;
  btn_agregar: any;
  grd_encuesta: any;
  btn_editar: any;
  btn_eliminar: any;
  pop_insertar: any;
  txt_nombre: any;
  cck_estado: any;
  cmb_tipo_campania: any;
  cmb_plantilla: any;
  dpk_fecha_inicio: any;
  dpk_fecha_fin: any;
  cck_habilita_noaceptar: any;
  btn_guardar: any;
  btn_cancelar: any;
  pop_editar: any;
  txt_nombre_edit: any;
  cck_estado_edit: any;
  cmb_tipo_campania_edit: any;
  cmb_plantilla_edit: any;
  dpk_fecha_inicio_edit: any;
  dpk_fecha_fin_edit: any;
  cck_habilita_noaceptar_edit: any;
  btn_guardar_edit: any;
  btn_cancelar_edit: any;
  pop_eliminar: any;
  btn_si_elim: any;
  btn_no_elim: any;

  fecha_inicio = new String();
  fecha_fin = new String();;
  tipo_campana_id:number=0;
  plantilla_id:number=0;

  Name: string;
  constructor(private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute, 
    private modalService: NgbModal, 
    private formBuilder: FormBuilder, 
    private encuestaService: EncuestaService, 
    private plantillaService: PlantillasService, 
    private campaniaService:TipoCampaniaService,
    private authService: MsalService
    ) { }

  

    //Validar Sesion
    ngAfterViewChecked(): void {
      this.encuestaService.isAuthenticated();
    }
    
  async ngOnInit() {
    try {
      this.encuestaService.isAuthenticated();
      this.Name = this.authService.instance.getActiveAccount()?.username;
      
      //await this.getPermissions(); //Borar permisos al habilitar los permisos del gsa  this.permisos = {"codigo": "rc_encuesta","nombre": "Encuesta","visualizar": true,"nuevo": true,"modificar": true,"eliminar": true,"exportar": true,"consulta": true,"procesar": true};
  
      const currentUser = localStorage.getItem('currentUser');
      const authData = JSON.parse(currentUser);
         
      if (currentUser) {
        this.permisos =authData.permiso.find(x => x.codigo === "rc_encuesta");
        
        this.btn_exportar = this.permisos.controles.find(x => x.codigo_control === "01");
        this.btn_agregar = this.permisos.controles.find(x => x.codigo_control === "02");
        this.grd_encuesta = this.permisos.controles.find(x => x.codigo_control === "03");
        this.btn_editar = this.permisos.controles.find(x => x.codigo_control === "04");
        this.btn_eliminar = this.permisos.controles.find(x => x.codigo_control === "05");
        this.pop_insertar = this.permisos.controles.find(x => x.codigo_control === "06");
        this.txt_nombre = this.permisos.controles.find(x => x.codigo_control === "07");
        this.cck_estado = this.permisos.controles.find(x => x.codigo_control === "08");
        this.cmb_tipo_campania = this.permisos.controles.find(x => x.codigo_control === "09");
        this.cmb_plantilla = this.permisos.controles.find(x => x.codigo_control === "10");
        this.dpk_fecha_inicio = this.permisos.controles.find(x => x.codigo_control === "11");
        this.dpk_fecha_fin = this.permisos.controles.find(x => x.codigo_control === "12");
        this.cck_habilita_noaceptar = this.permisos.controles.find(x => x.codigo_control === "13");
        this.btn_guardar = this.permisos.controles.find(x => x.codigo_control === "14");
        this.btn_cancelar = this.permisos.controles.find(x => x.codigo_control === "15");
        this.pop_editar = this.permisos.controles.find(x => x.codigo_control === "16");
        this.txt_nombre_edit = this.permisos.controles.find(x => x.codigo_control === "17");
        this.cck_estado_edit = this.permisos.controles.find(x => x.codigo_control === "18");
        this.cmb_tipo_campania_edit = this.permisos.controles.find(x => x.codigo_control === "19");
        this.cmb_plantilla_edit = this.permisos.controles.find(x => x.codigo_control === "20");
        this.dpk_fecha_inicio_edit = this.permisos.controles.find(x => x.codigo_control === "21");
        this.dpk_fecha_fin_edit = this.permisos.controles.find(x => x.codigo_control === "22");
        this.cck_habilita_noaceptar_edit = this.permisos.controles.find(x => x.codigo_control === "23");
        this.btn_guardar_edit = this.permisos.controles.find(x => x.codigo_control === "24");
        this.btn_cancelar_edit = this.permisos.controles.find(x => x.codigo_control === "25");
        this.pop_eliminar = this.permisos.controles.find(x => x.codigo_control === "26");
        this.btn_si_elim = this.permisos.controles.find(x => x.codigo_control === "27");
        this.btn_no_elim = this.permisos.controles.find(x => x.codigo_control === "28")
      }

      this.onTipoArchivoChange();
      this.consultaPlantillas();
      this.consultaTipoCampania();
      console.log("inicializando el form");
      this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
        id_tipo_campania : [Validators.required],
        id_plantilla : [Validators.required],
        habilitar_noaceptar: [false],
        estado: ['A'],
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
  
  reiniciarValores(){
    this.fecha_inicio=new String();
    this.fecha_fin = new String();
    this.tipo_campana_id=0;
    this.plantilla_id=0;
    this.estadoValue = 'I';
    this.estadoNoAceptar = false;
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
  
       this.encuestaService.getPermissions(this.Name, url).subscribe(
         (data: any) => {
          this.permisos = data;
          this.btn_exportar = this.permisos.controles.find(x => x.codigo_control === "01");
          this.btn_agregar = this.permisos.controles.find(x => x.codigo_control === "02");
          this.grd_encuesta = this.permisos.controles.find(x => x.codigo_control === "03");
          this.btn_editar = this.permisos.controles.find(x => x.codigo_control === "04");
          this.btn_eliminar = this.permisos.controles.find(x => x.codigo_control === "05");
          this.pop_insertar = this.permisos.controles.find(x => x.codigo_control === "06");
          this.txt_nombre = this.permisos.controles.find(x => x.codigo_control === "07");
          this.cck_estado = this.permisos.controles.find(x => x.codigo_control === "08");
          this.cmb_tipo_campania = this.permisos.controles.find(x => x.codigo_control === "09");
          this.cmb_plantilla = this.permisos.controles.find(x => x.codigo_control === "10");
          this.dpk_fecha_inicio = this.permisos.controles.find(x => x.codigo_control === "11");
          this.dpk_fecha_fin = this.permisos.controles.find(x => x.codigo_control === "12");
          this.cck_habilita_noaceptar = this.permisos.controles.find(x => x.codigo_control === "13");
          this.btn_guardar = this.permisos.controles.find(x => x.codigo_control === "14");
          this.btn_cancelar = this.permisos.controles.find(x => x.codigo_control === "15");
          this.pop_editar = this.permisos.controles.find(x => x.codigo_control === "16");
          this.txt_nombre_edit = this.permisos.controles.find(x => x.codigo_control === "17");
          this.cck_estado_edit = this.permisos.controles.find(x => x.codigo_control === "18");
          this.cmb_tipo_campania_edit = this.permisos.controles.find(x => x.codigo_control === "19");
          this.cmb_plantilla_edit = this.permisos.controles.find(x => x.codigo_control === "20");
          this.dpk_fecha_inicio_edit = this.permisos.controles.find(x => x.codigo_control === "21");
          this.dpk_fecha_fin_edit = this.permisos.controles.find(x => x.codigo_control === "22");
          this.cck_habilita_noaceptar_edit = this.permisos.controles.find(x => x.codigo_control === "23");
          this.btn_guardar_edit = this.permisos.controles.find(x => x.codigo_control === "24");
          this.btn_cancelar_edit = this.permisos.controles.find(x => x.codigo_control === "25");
          this.pop_eliminar = this.permisos.controles.find(x => x.codigo_control === "26");
          this.btn_si_elim = this.permisos.controles.find(x => x.codigo_control === "27");
          this.btn_no_elim = this.permisos.controles.find(x => x.codigo_control === "28")
          //  this.menuId = data.menuId;
          //  this.encuestaService.menu(this.menuId);
           resolve();
         },
         (error) => {
           console.error('There was an error!', error);
           reject(error);
         }
       );
    });
  }

  onFechaDesdeChange(event: any) {
    if (typeof event === 'object' && event instanceof Event) {
      return;
    }
    const fechaDesde = event;

    // Validar si la fecha es válida antes de cambiar fechaInicio
    if (fechaDesde && this.isValidDate(new Date(fechaDesde))) {
      this.fecha_inicio = new String(fechaDesde);
      const fechaDesdeDate = new Date(fechaDesde);
      const currentDate = new Date();

      // Calculamos la fecha límite, que es un año antes de la fecha actual.
      const oneYearBefore = new Date();
      oneYearBefore.setFullYear(currentDate.getFullYear() - 1);

      if (fechaDesdeDate > currentDate) {
        Swal.fire({
          text: 'Fecha desde no debe ser mayor a la fecha actual',
          icon: 'error',
        }).then((result) => {
          this.fecha_inicio = new String();
          this.fecha_fin = new String();
          if (result.isConfirmed) {
          }
        });
      } else if (
        !this.fecha_fin.toString() ||
        fechaDesdeDate >
        new Date(
          this.fecha_fin
            .toString()
        )
      ) {
        this.fecha_fin = this.fecha_inicio;
      }
    }
  }

  onFechaHastaChange(event: any) {
    if (typeof event === 'object' && event instanceof Event) {
    
      return;
    }
    const fechaHasta = event;
    this.fecha_fin = new String(fechaHasta);



    if (
      new Date(fechaHasta.replace(/-/g, "/").replace(/T.+/, "")) <
      new Date(this.fecha_inicio.replace(/-/g, "/").replace(/T.+/, ""))
    ) {
      Swal.fire({
        text: 'Fecha hasta no debe ser menor a la Fecha Desde',
        icon: 'error',
      }).then((result) => {
        this.fecha_fin = new String();
        if (result.isConfirmed) {
        }
      });
    }

    if (!this.fecha_inicio.toString()) {
      this.fecha_inicio = this.fecha_fin;
    }
  }

  onTipoCompaniaChange(event: any){
    this.tipo_campana_id = event.target.value;
  }

  onPlantillaChange(event: any){
    this.plantilla_id = event.target.value;
  }


   // Helper function para verificar si una fecha es válida
   isValidDate(d: any) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  onTipoArchivoChange() {
    this.isLoading = true;
    console.log("empezar a la capacidad para traer todas las encuestas");
    this.encuestaService.getConsultaEncuesta().subscribe((data: any) => {
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


  consultaPlantillas() {
    this.isLoading = true;
    console.log("empezar a la capacidad para traer todas las plantillas");
    this.plantillaService.getConsultaPlantilla().subscribe((data: any) => {
      this.catalogoPlantillas = data || [];
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


  consultaTipoCampania() {
    this.isLoading = true;
    this.campaniaService.getConsultaEncuesta().subscribe((data: any) => {
      this.catalogoCampanias = data || [];
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
    this.reiniciarValores();
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {
    });
  }

  nombreExist(nombre: string, idToExclude: number = null): boolean {
    return this.catalogoTipoRegistro.some(tipoArchivo => tipoArchivo.nombre === nombre && tipoArchivo.id !== idToExclude);
  }


  onSubmit() {
    //console.log("venimos aqui");
//
    //console.log("--------------------------------------------");
    //console.log(this.form.value );
    //console.log(this.fecha_inicio);
    //console.log(this.fecha_fin);
    //console.log(this.tipo_campana_id);
    //console.log(this.plantilla_id);
    //console.log(this.estadoValue);
    //console.log(this.estadoNoAceptar);
    //
    //console.log("--------------------------------------------");
    if (this.form.valid) {
      console.log("form valid");
      const tipoArchivo = { ...this.form.value }; // Añade el tipo seleccionado al objeto tipoArchivo
      //tipoArchivo.estado = this.estadoValue || 'I';
      // Verificar si el nombre ya existe en la base de datos al agregar
      if (this.nombreExist(tipoArchivo.titulo)) {
        Swal.fire('Error', 'El titulo ingresado ya existe. Por favor, elige otro Código.', 'error');
        return; // Retorna una función vacía para evitar cerrar el modal
      }
      if(this.tipo_campana_id==0){
        Swal.fire('Error', 'Seleccione tipo de campaña', 'error');
        return; // Retorna una función vacía para evitar cerrar el modal
      }
      if(this.plantilla_id==0){
        Swal.fire('Error', 'Seleccione la plantilla', 'error');
        return; // Retorna una función vacía para evitar cerrar el modal
      }
      if(this.fecha_inicio.length<=0 || this.fecha_fin.length<=0){
        Swal.fire('Error', 'Seleccione rango de fechas', 'error');
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
          let encuesta : Encuestas = {
            id: 0,
            id_plantilla: Number(this.plantilla_id),
            id_tipo_campania: Number(this.tipo_campana_id),
            nombre: this.form.value.nombre,
            habilitar_noaceptar: this.estadoNoAceptar,
            fecha_inicio: this.fecha_inicio.toString().split("-")[2]+"-"+this.fecha_inicio.toString().split("-")[0]+"-"+this.fecha_inicio.toString().split("-")[1],
            fecha_fin:  this.fecha_fin.toString().split("-")[2]+"-"+this.fecha_fin.toString().split("-")[0]+"-"+this.fecha_fin.toString().split("-")[1],
            estado: this.estadoValue
          };
          //console.log(encuesta);
          this.encuestaService.createEncuesta(encuesta).subscribe({
            next: (result) => {
              // Actualiza la lista de tipos de archivo y cierra el modal
              this.onTipoArchivoChange();
              this.modalService.dismissAll();
              this.form.reset(); // Limpia el formulario después de guardar
              this.reiniciarValores();
              this.isLoading = false;
              Swal.fire({
                text: 'Encuesta Creado con éxito.',
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
  }


  onDelete(tipoArchivo: Encuestas): void {
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
        this.encuestaService.deleteEncuesta(tipoArchivo.id).subscribe({
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

  fecha1:string="";
  fecha2:string="";

  darFormatoFechaStringMesDiaAnio(fecha:string){
    let fechaSinHora= fecha.split("T")[0];
    return fechaSinHora.split("-")[1]+"-"+fechaSinHora.split("-")[2]+"-"+fechaSinHora.split("-")[0];
  }

  onEdit(tipoArchivo: Encuestas, editModal): void {
    this.selectedTipoArchivo = { ...tipoArchivo }; // Crea una copia del objeto tipoArchivo para evitar cambios en tiempo real en la tabla
    this.originalTipoArchivo = { ...tipoArchivo }; // Guarda el tipo de archivo original
    this.form.setValue({
      nombre: tipoArchivo.nombre,
      id_tipo_campania: tipoArchivo.id_tipo_campania,
      id_plantilla: tipoArchivo.id_plantilla,
      estado: tipoArchivo.estado === 'I' ? false : true,
      habilitar_noaceptar: tipoArchivo.habilitar_noaceptar
    });
    this.fecha1=this.darFormatoFechaStringMesDiaAnio(this.selectedTipoArchivo.fecha_inicio);
    this.fecha2=this.darFormatoFechaStringMesDiaAnio(this.selectedTipoArchivo.fecha_fin);
    this.fecha_inicio= new String(this.fecha1);
    this.fecha_fin= new String(this.fecha2);
    //console.log(this.selectedTipoArchivo);
    //console.log(this.form);
    this.modalService.open(editModal, { size: 'lg' });
  }

  onSave(tipoArchivo: Encuestas): void {
    tipoArchivo.estado = this.estadoValue;
    //console.log(this.form.value);
    tipoArchivo.habilitar_noaceptar = this.estadoNoAceptar;
    tipoArchivo.id_plantilla = Number(this.form.value.id_plantilla);
    tipoArchivo.id_tipo_campania =  Number(this.form.value.id_tipo_campania);
    tipoArchivo.fecha_inicio = this.fecha_inicio.toString().split("-")[2]+"-"+this.fecha_inicio.toString().split("-")[0]+"-"+this.fecha_inicio.toString().split("-")[1];
    tipoArchivo.fecha_fin = this.fecha_fin.toString().split("-")[2]+"-"+this.fecha_fin.toString().split("-")[0]+"-"+this.fecha_fin.toString().split("-")[1];
    //console.log(tipoArchivo);
    // if (this.nombreExists(tipoArchivo.nombre, tipoArchivo.id)) {
    //   Swal.fire('Error', 'El nombre ingresado ya existe. Por favor, elige otro nombre.', 'error');
    //   this.selectedTipoArchivo.nombre = this.originalTipoArchivo.nombre; // Restaura el nombre original del tipo de archivo
    //   return; // Retorna una función vacía para evitar cerrar el modal
    // }

    // if (this.codigoExists(tipoArchivo.codigo, tipoArchivo.id)) {
    //   Swal.fire('Error', 'El Código ingresado ya existe. Por favor, elige otro Código.', 'error');
    //   this.selectedTipoArchivo.codigo = this.originalTipoArchivo.codigo; // Restaura el Código original del tipo de archivo
    //   return; // Retorna una función vacía para evitar cerrar el modal
    // }
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
        this.encuestaService.updateTipoArchivo(tipoArchivo).subscribe({
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

  estadoNoAceptar: boolean = false;

  onEstadoNoAceptarChange(event: any) {
    this.estadoNoAceptar = event.target.checked;
  }

  async exportToExcel(): Promise<void> {
    const dataCopy = this.catalogoTipoRegistro.map((catalogoTipoRegistro) => catalogoTipoRegistro);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Encuestas');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [
      'nombre',
      'no Aceptar',
      'fecha_desde',
      'fecha_hasta',
      'Estado'
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
        row.nombre,
        row.habilitar_noaceptar,
        row.fecha_inicio,
        row.fecha_fin,
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
    const fileName = 'Encuestas' + this.parseDate(new Date(), 'dd_MM_yyyy') + '.xlsx';
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
