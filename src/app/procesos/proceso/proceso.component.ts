
import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from './proceso.service';
import { Proceso } from "./proceso.clase";
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
@Component({
  selector: "app-proceso",
  templateUrl: "./proceso.component.html",
  styleUrls: ["./proceso.component.scss"],
})

export class ProcesosComponent implements OnInit {
  procesos: Proceso = new Proceso();
  procesosUpdate: Proceso = new Proceso();
  selectedOption: boolean = null;
  isLoading = false;
  dataProceso: Proceso[] = [];
  procesosAny: any[] = [];
  procesoslUpdate: Proceso[] = [];

  cpage = 1;
  cpageSize = 10;
  totalLengthOfCollection: number = 0;
  tipoFrecuenciaSeleccionado: string = null;
  isChecked: boolean = null;
  isCheckedes: boolean = null;
  selectedCheckbox: string;


  isCheckedL: boolean = null;
  isCheckedM: boolean = null;
  isCheckedMI: boolean = null;
  isCheckedJ: boolean = null;
  isCheckedV: boolean = null;
  isCheckedS: boolean = null;
  isCheckedDO: boolean = null;

  isCheckedLU: boolean = null;
  isCheckedMA: boolean = null;
  isCheckedMII: boolean = null;
  isCheckedJU: boolean = null;
  isCheckedVI: boolean = null;
  isCheckedSA: boolean = null;
  isCheckedDOO: boolean = null;
  id: 0;
  codigo: "";
  proceso: "";
  frecuencia: "";
  hora: "";
  diasemana: "";
  diasmes: "";
  aplicaferiado: false;
  estado: "";
  selectedDay: string;
  valorCampoTexto: string = '';
  horaSeleccionada: { hour: number, minute: number };
  Name: string;
  horasSeleccionadas: string[] = [];
  permisos: any;
  menuId: string;
  horaFormateada: string;
  //selectedOption: string;
  @ViewChild("myModalCrearProceso", { static: false }) myModalCrearProceso: TemplateRef<any>;
  @ViewChild("myModalModificarProceso", { static: false }) myModalModificarProceso: TemplateRef<any>;
  btn_exportar: any;
  btn_agregar: any;
  grd_proceso: any;
  btn_editar: any;
  btn_eliminar: any;
  pop_insertar: any;
  txt_codigo: any;
  cmb_frecuencia: any;
  cck_dias: any;
  txt_dia: any;
  txt_nombre_proceso: any;
  cck_aplica_feriado: any;
  cck_estado: any;
  txt_hora: any;
  tpk_hora: any;
  tpk_minuto: any;
  btn_incluir: any;
  btn_guardar: any;
  btn_cancelar: any;
  pop_editar: any;
  txt_codigo_edit: any;
  cmb_frecuencia_edit: any;
  cck_dias_edit: any;
  txt_dia_edit: any;
  txt_nombre_proceso_edit: any;
  cck_aplica_feriado_edit: any;
  cck_estado_edit: any;
  txt_hora_edit: any;
  tpk_hora_edit: any;
  tpk_minuto_edit: any;
  btn_incluir_edit: any;
  btn_guardar_edit: any;
  btn_cancelar_edit: any;
  pop_eliminar: any;
  btn_si_elim: any;
  btn_no_elim: any;

  constructor(private router: Router, private route: ActivatedRoute, private Procesos: DataService, private modalService: NgbModal, private authService: MsalService) { }

  //Validar Sesion
  ngAfterViewChecked(): void {
    this.Procesos.isAuthenticated();
  }

  async ngOnInit() {
    try {

      this.Name = this.authService.instance.getActiveAccount()?.username;
      this.Procesos.isAuthenticated();
  //    await this.getPermissions();
      await this.ObtieneDatosProcesos();

      const currentUser = localStorage.getItem('currentUser');
      const authData = JSON.parse(currentUser);
      if(currentUser){
        this.permisos =authData.permiso.find(x => x.codigo === "rc_proceso");
         this.btn_exportar = this.permisos.controles.find((x => x.codigo_control === "01"));
          this.btn_agregar = this.permisos.controles.find((x => x.codigo_control === "02"));
          this.grd_proceso = this.permisos.controles.find((x => x.codigo_control === "03"));
          this.btn_editar = this.permisos.controles.find((x => x.codigo_control === "04"));
          this.btn_eliminar = this.permisos.controles.find((x => x.codigo_control === "05"));
          this.pop_insertar = this.permisos.controles.find((x => x.codigo_control === "06"));
          this.txt_codigo = this.permisos.controles.find((x => x.codigo_control === "07"));
          this.cmb_frecuencia = this.permisos.controles.find((x => x.codigo_control === "08"));
          this.cck_dias = this.permisos.controles.find((x => x.codigo_control === "09"));
          this.txt_dia = this.permisos.controles.find((x => x.codigo_control === "10"));
          this.txt_nombre_proceso = this.permisos.controles.find((x => x.codigo_control === "11"));
          this.cck_aplica_feriado = this.permisos.controles.find((x => x.codigo_control === "12"));
          this.cck_estado = this.permisos.controles.find((x => x.codigo_control === "13"));
          this.txt_hora = this.permisos.controles.find((x => x.codigo_control === "14"));
          this.tpk_hora = this.permisos.controles.find((x => x.codigo_control === "15"));
          this.tpk_minuto = this.permisos.controles.find((x => x.codigo_control === "16"));
          this.btn_incluir = this.permisos.controles.find((x => x.codigo_control === "17"));
          this.btn_guardar = this.permisos.controles.find((x => x.codigo_control === "18"));
          this.btn_cancelar = this.permisos.controles.find((x => x.codigo_control === "19"));
          this.pop_editar = this.permisos.controles.find((x => x.codigo_control === "20"));
          this.txt_codigo_edit = this.permisos.controles.find((x => x.codigo_control === "21"));
          this.cmb_frecuencia_edit = this.permisos.controles.find((x => x.codigo_control === "22"));
          this.cck_dias_edit = this.permisos.controles.find((x => x.codigo_control === "23"));
          this.txt_dia_edit = this.permisos.controles.find((x => x.codigo_control === "24"));
          this.txt_nombre_proceso_edit = this.permisos.controles.find((x => x.codigo_control === "25"));
          this.cck_aplica_feriado_edit = this.permisos.controles.find((x => x.codigo_control === "26"));
          this.cck_estado_edit = this.permisos.controles.find((x => x.codigo_control === "27"));
          this.txt_hora_edit = this.permisos.controles.find((x => x.codigo_control === "28"));
          this.tpk_hora_edit = this.permisos.controles.find((x => x.codigo_control === "29"));
          this.tpk_minuto_edit = this.permisos.controles.find((x => x.codigo_control === "30"));
          this.btn_incluir_edit = this.permisos.controles.find((x => x.codigo_control === "31"));
          this.btn_guardar_edit = this.permisos.controles.find((x => x.codigo_control === "32"));
          this.btn_cancelar_edit = this.permisos.controles.find((x => x.codigo_control === "33"));
          this.pop_eliminar = this.permisos.controles.find((x => x.codigo_control === "34"));
          this.btn_si_elim = this.permisos.controles.find((x => x.codigo_control === "35"));
          this.btn_no_elim = this.permisos.controles.find((x => x.codigo_control === "36"));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }

  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      //const idRol = JSON.parse(localStorage.getItem('currentUser')).rolId;
      const url = this.router.url.substring(1);

      this.Procesos.getPermissions(this.Name, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.menuId = data.menuId;
          this.Procesos.menu(this.menuId);


          //Permisos de controles 
          this.btn_exportar = this.permisos.controles.find((x => x.codigo_control === "01"));
          this.btn_agregar = this.permisos.controles.find((x => x.codigo_control === "02"));
          this.grd_proceso = this.permisos.controles.find((x => x.codigo_control === "03"));
          this.btn_editar = this.permisos.controles.find((x => x.codigo_control === "04"));
          this.btn_eliminar = this.permisos.controles.find((x => x.codigo_control === "05"));
          this.pop_insertar = this.permisos.controles.find((x => x.codigo_control === "06"));
          this.txt_codigo = this.permisos.controles.find((x => x.codigo_control === "07"));
          this.cmb_frecuencia = this.permisos.controles.find((x => x.codigo_control === "08"));
          this.cck_dias = this.permisos.controles.find((x => x.codigo_control === "09"));
          this.txt_dia = this.permisos.controles.find((x => x.codigo_control === "10"));
          this.txt_nombre_proceso = this.permisos.controles.find((x => x.codigo_control === "11"));
          this.cck_aplica_feriado = this.permisos.controles.find((x => x.codigo_control === "12"));
          this.cck_estado = this.permisos.controles.find((x => x.codigo_control === "13"));
          this.txt_hora = this.permisos.controles.find((x => x.codigo_control === "14"));
          this.tpk_hora = this.permisos.controles.find((x => x.codigo_control === "15"));
          this.tpk_minuto = this.permisos.controles.find((x => x.codigo_control === "16"));
          this.btn_incluir = this.permisos.controles.find((x => x.codigo_control === "17"));
          this.btn_guardar = this.permisos.controles.find((x => x.codigo_control === "18"));
          this.btn_cancelar = this.permisos.controles.find((x => x.codigo_control === "19"));
          this.pop_editar = this.permisos.controles.find((x => x.codigo_control === "20"));
          this.txt_codigo_edit = this.permisos.controles.find((x => x.codigo_control === "21"));
          this.cmb_frecuencia_edit = this.permisos.controles.find((x => x.codigo_control === "22"));
          this.cck_dias_edit = this.permisos.controles.find((x => x.codigo_control === "23"));
          this.txt_dia_edit = this.permisos.controles.find((x => x.codigo_control === "24"));
          this.txt_nombre_proceso_edit = this.permisos.controles.find((x => x.codigo_control === "25"));
          this.cck_aplica_feriado_edit = this.permisos.controles.find((x => x.codigo_control === "26"));
          this.cck_estado_edit = this.permisos.controles.find((x => x.codigo_control === "27"));
          this.txt_hora_edit = this.permisos.controles.find((x => x.codigo_control === "28"));
          this.tpk_hora_edit = this.permisos.controles.find((x => x.codigo_control === "29"));
          this.tpk_minuto_edit = this.permisos.controles.find((x => x.codigo_control === "30"));
          this.btn_incluir_edit = this.permisos.controles.find((x => x.codigo_control === "31"));
          this.btn_guardar_edit = this.permisos.controles.find((x => x.codigo_control === "32"));
          this.btn_cancelar_edit = this.permisos.controles.find((x => x.codigo_control === "33"));
          this.pop_eliminar = this.permisos.controles.find((x => x.codigo_control === "34"));
          this.btn_si_elim = this.permisos.controles.find((x => x.codigo_control === "35"));
          this.btn_no_elim = this.permisos.controles.find((x => x.codigo_control === "36"));
          resolve();
        },
        (error) => {
          console.error('There was an error!', error);
          reject(error);
        }
      );
    });
  }

  onCheckboxChange(value: string) {
    this.selectedCheckbox = value;
  }

  async ObtieneDatosProcesos() {
    this.isLoading = true;
    const consultarProductos = () => {
      return new Promise((resolve) => {
        this.Procesos.obtenerDatos().subscribe(
          (response) => {
            this.dataProceso = response;
            this.totalLengthOfCollection = this.dataProceso.length;
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
    return consultarProductos();
  }

  onFrecuenciaChange(event: any) {
    this.tipoFrecuenciaSeleccionado = event.target.value;
  }

  mostrarModalAgregarProceso() {

    this.modalService.open(this.myModalCrearProceso, {

      centered: true,
      size: <any>"xs",

      scrollable: true,
      beforeDismiss: () => {
        this.tipoFrecuenciaSeleccionado = null;
        this.tipoFrecuenciaSeleccionado = null;
        this.horaSeleccionada = null;
        this.horasSeleccionadas = [];
        this.valorCampoTexto = null;
        return true;
      },

    });
    this.isLoading = false;

  }

  mostrarModalModificarProceso(id, codigo, proceso, frecuencia, hora, diasemana, diasmes, aplicaferiado, estado) {
    //this.diasemana=diasemana;
    //Limpiar Para Modificar
    (() => {
      this.isCheckedL = false;
      this.isCheckedM = false;
      this.isCheckedMI = false;
      this.isCheckedJ = false;
      this.isCheckedV = false;
      this.isCheckedS = false;
      this.isCheckedDO = false;
    })();

    if (frecuencia == 'Diaria') {
      this.tipoFrecuenciaSeleccionado = frecuencia;
    } else if (frecuencia == 'Semanal') {
      this.tipoFrecuenciaSeleccionado = frecuencia;
    } else if (frecuencia == 'Mensual') {
      this.tipoFrecuenciaSeleccionado = frecuencia;
    }

    this.id = id;
    this.codigo = codigo;
    this.proceso = proceso;
    this.hora = hora;
    this.diasmes = (diasmes === 0) ? '' : diasmes;
    this.estado = estado;
    this.isLoading = true;

    if (estado == "A") {
      this.isCheckedes = true;
    } else if (estado == "I") {
      this.isCheckedes = false;
    }

    if (diasemana == "L") {
      this.selectedDay = 'Lunes';
    }
    else if (diasemana == "Ma") {
      this.selectedDay = 'Martes';
    }
    else if (diasemana == "Mi") {
      this.selectedDay = 'Miercoles';
    }
    else if (diasemana == "J") {
      this.selectedDay = 'Jueves';
    }
    else if (diasemana == "V") {
      this.selectedDay = 'Viernes';
    }
    else if (diasemana == "S") {
      this.selectedDay = 'Sabado';
    }
    else if (diasemana == "D") {
      this.selectedDay = 'Domingo';
    }

    if (diasemana == "L,Ma,Mi,J,V") {
      this.isCheckedL = true;
      this.isCheckedM = true;
      this.isCheckedMI = true;
      this.isCheckedJ = true;
      this.isCheckedV = true;
      this.isCheckedS = false;
      this.isCheckedDO = false;

    } else if (diasemana == "L,Ma,Mi,J,V,S,D") {
      this.isCheckedL = true;
      this.isCheckedM = true;
      this.isCheckedMI = true;
      this.isCheckedJ = true;
      this.isCheckedV = true;
      this.isCheckedS = true;
      this.isCheckedDO = true;
    }

    if (aplicaferiado == true) {
      this.isChecked = true;
    } else if (aplicaferiado == false) {
      this.isChecked = false;
    }

    this.modalService.open(this.myModalModificarProceso, {

      centered: true,
      size: <any>"xs",

      scrollable: true,
      beforeDismiss: () => {
        this.tipoFrecuenciaSeleccionado = null;
        this.horaSeleccionada = null;
        this.horasSeleccionadas = [];
        this.valorCampoTexto = null;
        this.selectedDay = null;
        return true;
      },


    });
    this.isLoading = false;

  }

  codigoExists(codigo: string): boolean {
    return this.dataProceso.some(dataProceso => dataProceso.codigo === codigo);
  }

  onSaveProceso() {
    const codigo = (document.getElementById('codigo') as HTMLInputElement).value;
    const nombreProceso = (document.getElementById('nombreProceso') as HTMLInputElement).value;
    const aplicaFeriado = (document.getElementById('aplicaFeriado') as HTMLInputElement).checked;
    const hora = (document.getElementById('hora') as HTMLInputElement).value;
    const lunes = (document.getElementById('lunes') as HTMLInputElement);
    const martes = (document.getElementById('martes') as HTMLInputElement);
    const miercoles = (document.getElementById('miercoles') as HTMLInputElement);
    const jueves = (document.getElementById('jueves') as HTMLInputElement);
    const viernes = (document.getElementById('viernes') as HTMLInputElement);
    const sabado = (document.getElementById('sabado') as HTMLInputElement);
    const domingo = (document.getElementById('domingo') as HTMLInputElement);
    const diaUnico = (document.getElementById('diaUnico') as HTMLInputElement);
    const estado = (document.getElementById('estado') as HTMLInputElement).checked;
    // Verificar si el Codigo ya existe en la base de datos al agregar

    if (!this.tipoFrecuenciaSeleccionado) {
      Swal.fire({
        icon: 'warning',
        text: 'Debe ingresar el Campo de Frecuencia',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });
      return;
    }

    if (this.tipoFrecuenciaSeleccionado == "Mensual" && diaUnico.value.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, ingrese el día',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });

      return; // Retorna una función vacía para evitar cerrar el modal
    } else if (codigo.trim() === '' || nombreProceso.trim() === '' || hora.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, completa todos los campos',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });

      return; // Retorna una función vacía para evitar cerrar el modal
    }

    if (this.tipoFrecuenciaSeleccionado == "Diaria") {
      if (!lunes.checked && !martes.checked && !miercoles.checked &&
        !jueves.checked && !viernes.checked && !sabado.checked && !domingo.checked) {
        Swal.fire({
          icon: 'warning',
          text: 'Debes seleccionar al menos una opción',
          confirmButtonColor: 'rgb(227, 199, 22)',
        });

        return; // Retorna una función vacía para evitar cerrar el modal
      }

    } else
      if (this.tipoFrecuenciaSeleccionado == "Semanal") {
        if (!lunes.checked && !martes.checked && !miercoles.checked &&
          !jueves.checked && !viernes.checked && !sabado.checked && !domingo.checked) {
          Swal.fire({
            icon: 'warning',
            text: 'Debes seleccionar una opción',
            confirmButtonColor: 'rgb(227, 199, 22)',
          });

          return; // Retorna una función vacía para evitar cerrar el modal
        }

      } else if (this.tipoFrecuenciaSeleccionado == "Mensual") {

        if (parseInt(diaUnico.value) > 31) {
          Swal.fire({
            icon: 'warning',
            text: 'Día Incorrecto',
            confirmButtonColor: 'rgb(227, 199, 22)',
          });

          return; // Retorna una función vacía para evitar cerrar el modal
        }

      }



    if (this.codigoExists(codigo)) {
      Swal.fire({
        icon: 'warning',
        text: 'El Codigo ingresado ya existe. Por favor, ingrese otro Codigo.',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });

      return; // Retorna una función vacía para evitar cerrar el modal
    } else if (codigo.toString().length > 5) {
      Swal.fire({
        icon: 'warning',
        text: 'El Maximo de Caracteres es 5',
        confirmButtonColor: 'rgb(227, 199, 22)',
      })
    } else {
      Swal.fire({
        text: '¿Desea crear un nuevo proceso?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'rgb(227, 199, 22)',
        cancelButtonColor: '#77797a',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',

      }).then((result) => {
        if (result.isConfirmed) {
          if (this.tipoFrecuenciaSeleccionado == "Diaria" || this.tipoFrecuenciaSeleccionado == "Semanal") {

            if (this.tipoFrecuenciaSeleccionado == "Diaria") {
              const diasSeleccionados = [];
        
              if (lunes.checked) {
                diasSeleccionados.push("L");
              }
              if (martes.checked) {
                diasSeleccionados.push("Ma");
              }
              if (miercoles.checked) {
                diasSeleccionados.push("Mi");
              }
              if (jueves.checked) {
                diasSeleccionados.push("J");
              }
              if (viernes.checked) {
                diasSeleccionados.push("V");
              }
              if (sabado.checked) {
                diasSeleccionados.push("S");
              }
              if (domingo.checked) {
                diasSeleccionados.push("D");
              }
        
              this.procesosUpdate.diasemana = diasSeleccionados.join(',');
            } else if (this.tipoFrecuenciaSeleccionado == "Semanal") {
              if (lunes.checked == true) {
                this.procesos.diasemana = "L"
              } else if (martes.checked == true) {
                this.procesos.diasemana = "Ma"
              } else if (miercoles.checked == true) {
                this.procesos.diasemana = "Mi"
              } else if (jueves.checked == true) {
                this.procesos.diasemana = "J"
              } else if (viernes.checked == true) {
                this.procesos.diasemana = "V"
              } else if (sabado.checked == true) {
                this.procesos.diasemana = "S"
              } else if (domingo.checked == true) {
                this.procesos.diasemana = "D"
              }
            }
          } else if (this.tipoFrecuenciaSeleccionado == "Mensual") {

            this.procesos.diasmes = parseInt(diaUnico.value);
          } if (this.tipoFrecuenciaSeleccionado != "Mensual") {
            this.procesos.diasmes = 0;
          }

          if (aplicaFeriado) {
            this.procesos.aplica_feriado = aplicaFeriado;
          } else if (!aplicaFeriado) {
            this.procesos.aplica_feriado = aplicaFeriado;
          }

          this.procesos.codigo = codigo;
          this.procesos.proceso = nombreProceso;
          this.procesos.frecuencia = this.tipoFrecuenciaSeleccionado;
          if (estado) {
            const checkbox = "A";
            this.procesos.estado = checkbox;
          } else if (!estado) {
            const checkbox = "I";
            this.procesos.estado = checkbox;
          }
          //this.procesos.estado="A";
          this.procesos.hora = hora;

          // Crear un nuevo registro
          this.Procesos.GuardarProceso(this.procesos).subscribe(
            (newProceso) => {
              this.dataProceso[0] = newProceso;
              this.ObtieneDatosProcesos().then((response) => { });
              this.modalService.dismissAll();
              Swal.fire({
                text: 'Proceso Creado Correctamente.',
                icon: 'success',
                confirmButtonColor: 'rgb(227, 199, 22)',
              });

              this.tipoFrecuenciaSeleccionado = null;
              this.horaSeleccionada = null;
              this.horasSeleccionadas = [];
              this.valorCampoTexto = null;
              this.selectedCheckbox = '';
            },
            (error) => {
              console.error("Error al Guardar ", error);
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

  limpiarCampos() {
    this.valorCampoTexto = '';
    this.hora = '';
    this.horaFormateada = '';
    this.horasSeleccionadas = [];
  }

  onAgregarHora() {
    if (this.horaSeleccionada) {
      const horas = this.padLeft(this.horaSeleccionada.hour.toString(), 2, '0');
      const minuto = this.padLeft(this.horaSeleccionada.minute.toString(), 2, '0');

      this.horaFormateada = `${horas}:${minuto}`;
      this.horasSeleccionadas.push(this.horaFormateada);

      // Limpiar la selección del NgbTimepicker
      this.horaSeleccionada = null;
    }
    this.setearValor();

  }

  setearValor() {
    this.valorCampoTexto = this.horasSeleccionadas.join(', ');
  }

  padLeft(value: string, width: number, paddingChar: string): string {
    return value.length >= width ? value : new Array(width - value.length + 1).join(paddingChar) + value;
  }

  onUpdateProceso(id) {
    const codigo = (document.getElementById('codigoM') as HTMLInputElement).value;
    const nombreProceso = (document.getElementById('nombreProcesoM') as HTMLInputElement).value;
    const aplicaFeriado = (document.getElementById('aplicaFeriadoM') as HTMLInputElement).checked;
    const hora = (document.getElementById('horaM') as HTMLInputElement).value;
    const lunes = (document.getElementById('lunesM') as HTMLInputElement);
    const martes = (document.getElementById('martesM') as HTMLInputElement);
    const miercoles = (document.getElementById('miercolesM') as HTMLInputElement);
    const jueves = (document.getElementById('juevesM') as HTMLInputElement);
    const viernes = (document.getElementById('viernesM') as HTMLInputElement);
    const sabado = (document.getElementById('sabadoM') as HTMLInputElement);
    const domingo = (document.getElementById('domingoM') as HTMLInputElement);
    const diaUnico = (document.getElementById('diaUnicoM') as HTMLInputElement);
    const estado = (document.getElementById('estadoM') as HTMLInputElement).checked;

    if (this.tipoFrecuenciaSeleccionado == "Mensual" && diaUnico.value.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, ingrese el día',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });
      return; // Retorna una función vacía para evitar cerrar el modal
    } else if (codigo.trim() === '' || nombreProceso.trim() === '') {
      Swal.fire({
        icon: 'warning',
        text: 'Por favor, completa todos los campos',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });

      return; // Retorna una función vacía para evitar cerrar el modal
    }

    // Verificar si el Codigo ya existe en la base de datos al agregar
    if (this.tipoFrecuenciaSeleccionado == "Diaria") {
      if (!lunes.checked && !martes.checked && !miercoles.checked &&
        !jueves.checked && !viernes.checked && !sabado.checked && !domingo.checked) {
        Swal.fire({
          icon: 'warning',
          text: 'Debes seleccionar al menos una opción',
          confirmButtonColor: 'rgb(227, 199, 22)',
        });

        return; // Retorna una función vacía para evitar cerrar el modal
      }

    } else
      if (this.tipoFrecuenciaSeleccionado == "Semanal") {
        if (!lunes.checked && !martes.checked && !miercoles.checked &&
          !jueves.checked && !viernes.checked && !sabado.checked && !domingo.checked) {
          Swal.fire({
            icon: 'warning',
            text: 'Debes seleccionar una opción',
            confirmButtonColor: 'rgb(227, 199, 22)',
          });
          return; // Retorna una función vacía para evitar cerrar el modal
        }

      } else if (this.tipoFrecuenciaSeleccionado == "Mensual") {
        if (parseInt(diaUnico.value) > 31) {
          Swal.fire({
            icon: 'warning',
            text: 'Día Incorrecto',
            confirmButtonColor: 'rgb(227, 199, 22)',
          });
          return; // Retorna una función vacía para evitar cerrar el modal
        }
      }

    if (codigo.toString().length > 5) {
      Swal.fire({
        icon: 'warning',
        text: 'El Maximo de Caracteres es 5',
        confirmButtonColor: 'rgb(227, 199, 22)',
      })

    }
    if (this.valorCampoTexto == '' && this.hora == '') {
      Swal.fire({
        text: 'La Hora debe ser Ingresada',
        icon: 'error',
        confirmButtonColor: 'rgb(227, 199, 22)',
      });
    }
    else {
      Swal.fire({
        text: '¿Desea Modificar el proceso?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: 'rgb(227, 199, 22)',
        cancelButtonColor: '#77797a',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {

          if (this.tipoFrecuenciaSeleccionado == "Diaria" || this.tipoFrecuenciaSeleccionado == "Semanal") {

            if (this.tipoFrecuenciaSeleccionado == "Diaria") {
              const diasSeleccionados = [];
        
              if (lunes.checked) {
                diasSeleccionados.push("L");
              }
              if (martes.checked) {
                diasSeleccionados.push("Ma");
              }
              if (miercoles.checked) {
                diasSeleccionados.push("Mi");
              }
              if (jueves.checked) {
                diasSeleccionados.push("J");
              }
              if (viernes.checked) {
                diasSeleccionados.push("V");
              }
              if (sabado.checked) {
                diasSeleccionados.push("S");
              }
              if (domingo.checked) {
                diasSeleccionados.push("D");
              }
        
              this.procesosUpdate.diasemana = diasSeleccionados.join(',');
            } else if (this.tipoFrecuenciaSeleccionado == "Semanal") {
              if (lunes.checked == true) {
                this.procesosUpdate.diasemana = "L"
              } else if (martes.checked == true) {
                this.procesosUpdate.diasemana = "Ma"
              } else if (miercoles.checked == true) {
                this.procesosUpdate.diasemana = "Mi"
              } else if (jueves.checked == true) {
                this.procesosUpdate.diasemana = "J"
              } else if (viernes.checked == true) {
                this.procesosUpdate.diasemana = "V"
              } else if (sabado.checked == true) {
                this.procesosUpdate.diasemana = "S"
              } else if (domingo.checked == true) {
                this.procesosUpdate.diasemana = "D"
              }
            }
          } if (this.tipoFrecuenciaSeleccionado == "Mensual") {
            this.procesosUpdate.diasmes = parseInt(diaUnico.value);
            this.procesosUpdate.diasemana = '';
            this.isCheckedLU = false;
            this.isCheckedMA = false;
            this.isCheckedMII = false;
            this.isCheckedJU = false;
            this.isCheckedVI = false;
            this.isCheckedSA = false;
            this.isCheckedDOO = false;
            this.isCheckedL = false;
            this.isCheckedM = false;
            this.isCheckedMI = false;
            this.isCheckedJ = false;
            this.isCheckedV = false;
            this.isCheckedS = false;
            this.isCheckedDO = false;
          } if (this.tipoFrecuenciaSeleccionado != "Mensual") {
            this.procesosUpdate.diasmes = 0;
          }

          if (aplicaFeriado) {
            this.procesosUpdate.aplica_feriado = aplicaFeriado;
          } else if (!aplicaFeriado) {
            this.procesosUpdate.aplica_feriado = aplicaFeriado;
          }

          this.procesosUpdate.id = id;
          this.procesosUpdate.codigo = codigo;
          this.procesosUpdate.proceso = nombreProceso;
          this.procesosUpdate.frecuencia = this.tipoFrecuenciaSeleccionado;
          if (this.valorCampoTexto == '' || this.valorCampoTexto == null) {
            this.procesosUpdate.hora = this.hora;
          } else {
            this.procesosUpdate.hora = this.hora ? `${this.hora},${hora}` : hora;
          }
          if (estado) {
            const checkbox = "A";
            this.procesosUpdate.estado = checkbox;
          } else if (!estado) {
            const checkbox = "I";
            this.procesosUpdate.estado = checkbox;
          }

          // Modificar un proceso

          if (this.procesosUpdate.id) {
            // Si existe el ID, actualizar el registro existente
            this.Procesos.updateProceso(this.procesosUpdate).subscribe(
              (updatedproceo) => {
                // Actualiza la lista 
                const index = this.procesoslUpdate.findIndex(t => t.id === updatedproceo.id);
                if (index !== -1) {
                  this.procesoslUpdate[index] = updatedproceo;
                }
                this.ObtieneDatosProcesos().then((response) => { });
                this.modalService.dismissAll();
                Swal.fire({
                  text: 'Proceso Editado Correctamente.',
                  icon: 'success',
                  confirmButtonColor: 'rgb(227, 199, 22)',
                });

                this.tipoFrecuenciaSeleccionado = null;
                this.horaSeleccionada = null;
                this.horasSeleccionadas = [];
                this.valorCampoTexto = null;
                this.selectedOption = false;
                this.selectedCheckbox = '';
                this.isCheckedL = false;
                this.isCheckedM = false;
                this.isCheckedMI = false;
                this.isCheckedJ = false;
                this.isCheckedV = false;
                this.isCheckedS = false;
                this.isCheckedDO = false;
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

  onDeleteProceso(id) {
    Swal.fire({
      text: '¿Estás seguro de que deseas eliminar el Proceso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(227, 199, 22)',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {

        this.Procesos.deleteproceso(id).subscribe((response) => {

          this.ObtieneDatosProcesos().then((response) => { });
          Swal.fire({
            text: 'Proceso Eliminado Correctamente.',
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
          });

      }
    })
  }

  async actualizarTabla() {
    const consultarProductos = () => {
      return new Promise((resolve) => {
        this.Procesos.obtenerDatos().subscribe(
          (response) => {
            this.dataProceso = response;

            resolve(true)
          },
          error => {
            resolve(true);
          }
        )
      })
    }
    return consultarProductos();
  }

  async exportToExcelProceso(): Promise<void> {
    const dataCopy = this.dataProceso.map((Procesos) => {
      const { id, estado, ...rest } = Procesos;

      return {
        ...rest,

      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Procesos');

    // Personaliza los nombres de las columnas de encabezado aquí
    const headers = [
      'Código',
      'Nombre de proceso',
      'Frecuencia',
      'Días',
      'Día único',
      'Hora',
      'Feriados',
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
        row.codigo,
        row.proceso,
        row.frecuencia,
        row.diasemana,
        row.diasmes !== 0 ? row.diasmes : '',
        row.hora,
        row.aplica_feriado !== false ? '✓' : '✕',
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
      column.width = headers[index] === 'Nombre de proceso' ? 60 : 20;
    });

    // Exporta el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = 'Procesos_' + this.parseDate(new Date(), 'dd_MM_yyyy') + '.xlsx';
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
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

  // Define un arreglo con los días de la semana
diasSemana = [
  { code: 'L', name: 'Lunes' },
  { code: 'Ma', name: 'Martes' },
  { code: 'Mi', name: 'Miércoles' },
  { code: 'J', name: 'Jueves' },
  { code: 'V', name: 'Viernes' },
  { code: 'S', name: 'Sábado' },
  { code: 'D', name: 'Domingo' }
];

// Función para construir la cadena de días seleccionados
construirCadenaDias(diasSeleccionados: string[]): string {
  const dias = this.diasSemana
    .filter(dia => diasSeleccionados.includes(dia.code))
    .map(dia => dia.name);
  
  return dias.join(', ');
}
}
