import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { EncuestaService } from 'src/app/configuracion/encuesta/encuesta.service';
import { Encuestas } from 'src/app/model/encuesta';
import { Hacienda } from 'src/app/model/hacienda';
import { Zona } from 'src/app/model/zona';
import { HaciendaService } from 'src/app/permisos/permisos/hacienda.service';
import { ZonaService } from 'src/app/permisos/permisos/zona.service';
import Swal from 'sweetalert2';
import { PersonaService } from '../persona.service';
import { Persona } from 'src/app/model/persona';
import { MsalService } from '@azure/msal-angular';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']

})
export class ResumenComponent implements OnInit {

  // permiso: Permisos = new Permisos();

  // dataPermisos :Permisos[] = [];
  // dataEncuesta :Encuestas[] = [];
  // dataDispositivo :Dispositivos[] = [];
  // dataPemisoDispositivo: PermisoDispositivo[] = [];
  // isLoading = false;
  // idEncuestaSeleccionada:number=0;
  // nombreEncuestaSeleccionada:string;
  // identificadorDispositivo:string;
  // nombreDispositivoSeleccionado:string;

  // IdRolSeleccionado : number = null;

  passwordValue: string;
  permisos: any;
  menuId: string;

  isLoading = false;
  dataEncuesta: Encuestas[] = [];
  encuesta_id: number = 0;
  fecha_inicio: string;
  fecha_fin: string;
  dataZona: Zona[] = [];
  zona_id: string = "";
  dataHacienda: Hacienda[] = [];
  hacienda_id: string = "";
  datePersona: Persona[] = [];
  data: number[] = [];


  total: number = 0;
  aceptacion: number = 0;
  noAcepta: number = 0;
  pendiente: number = 0;
  porcentaje_aceptacion: number = 0;
  porcentaje_no_acepta: number = 0;
  porcentaje_pendiente: number = 0;

  porcentaje_cumplimiento: number = 0;

  cmb_encuesta: any;
  cmb_zona: any;
  cmb_hacienda: any;
  chart_resumen: any;
  chart_pastel: any;

  Name: string;

  @ViewChild('pieChart') private pieChartRef: ElementRef;
  constructor(private router: Router,
    private encuestaService: EncuestaService,
    private zonaService: ZonaService,
    private haciendaService: HaciendaService,
    private personaService: PersonaService,
    private authService: MsalService,
    private config: NgSelectConfig) {
    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
    this.config.bindValue = 'value';
  }
  //Validar Sesion
  ngAfterViewChecked(): void {
    this.personaService.isAuthenticated();
  }

  ngAfterViewInit(): void {
    this.cargarChart();
  }

  cargarChart() {
    const pieChartRef = this.pieChartRef.nativeElement;
    new Chart(pieChartRef, {
      type: 'pie',
      data: {
        labels: ['Aceptado', 'No acepta', 'Pendiente'],
        datasets: [{
          data: this.data,
          backgroundColor: ['green', 'orange', 'red']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  async ngOnInit() {
    try {
      this.personaService.isAuthenticated();
      this.Name = this.authService.instance.getActiveAccount()?.username;
      //await this.getPermissions();
      const currentUser = localStorage.getItem('currentUser');
      const authData = JSON.parse(currentUser);
      if (currentUser) {
        this.permisos = authData.permiso.find(x => x.codigo === "rc_dashboard");

        this.cmb_encuesta = this.permisos.controles.find(x => x.codigo_control === "01");
        this.cmb_zona = this.permisos.controles.find(x => x.codigo_control === "02");
        this.cmb_hacienda = this.permisos.controles.find(x => x.codigo_control === "03");
        this.chart_resumen = this.permisos.controles.find(x => x.codigo_control === "04");
        this.chart_pastel = this.permisos.controles.find(x => x.codigo_control === "05");
      }


      this.consultarEncuestas();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = this.router.url.substring(1);

      this.personaService.getPermissions(this.Name, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.cmb_encuesta = this.permisos.controles.find(x => x.codigo_control === "01");
          this.cmb_zona = this.permisos.controles.find(x => x.codigo_control === "02");
          this.cmb_hacienda = this.permisos.controles.find(x => x.codigo_control === "03");
          this.chart_resumen = this.permisos.controles.find(x => x.codigo_control === "04");
          this.chart_pastel = this.permisos.controles.find(x => x.codigo_control === "05");
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

  onChangeEncuesta(event: any) {
    this.encuesta_id = event;
    const id = Number(event);
    const objetoEncontrado = this.dataEncuesta.find(item => item.id === id);
    this.fecha_inicio = objetoEncontrado.fecha_inicio.toString().split("T")[0];
    this.fecha_fin = objetoEncontrado.fecha_fin.toString().split("T")[0];
    this.dataZona = [];
    this.dataHacienda = [];
    this.consultarZonas(this.encuesta_id);
  }

  onChangeZona(event: any) {
    this.zona_id = event;
    this.dataHacienda = [];
    this.consultarHaciendas(this.zona_id, this.encuesta_id);
  }

  onChangeHacienda(event: any) {
    this.hacienda_id = event;
    this.consultarPersonaEncuestaHacienda(this.encuesta_id, this.hacienda_id);
  }

  consultarEncuestas() {
    debugger
    this.isLoading = true;
    this.encuestaService.getConsultaEncuesta().subscribe((data: any) => {
      this.dataEncuesta = data || [];
      //console.log(this.dataEncuesta);
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

  consultarZonas(encuesta_id: number) {
    debugger
    this.isLoading = true;
    this.zonaService.consultarZonaPorEncuesta(encuesta_id).subscribe((data: any) => {
      this.dataZona = data || [];
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

  consultarHaciendas(zona_id: string, encuesta_id: number) {
    debugger
    this.isLoading = true;
    this.haciendaService.consultarHaciendaPorEncuestaZona(zona_id, encuesta_id).subscribe((data: any) => {
      this.dataHacienda = data || [];
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

  consultarPersonaEncuestaHacienda(encuesta_id: number, hacienda_id: string) {
    this.isLoading = true;
    this.personaService.consultarRegistroEncuestaHacienda(encuesta_id, hacienda_id).subscribe((data: any) => {
      this.datePersona = data || [];
      debugger
      //console.log(data);
      if (this.datePersona.length > 0) {
        this.total = this.datePersona.length;
        const personaPendiente = this.datePersona.filter(objeto => objeto.estado_proceso === 'N');
        this.pendiente = personaPendiente.length;
        let encuestasRealizadas = this.datePersona.filter(objeto => objeto.estado_proceso === 'S');
        this.aceptacion = encuestasRealizadas.filter(objeto => objeto.estado_aceptacion === 'S').length;
        this.noAcepta = encuestasRealizadas.length - this.aceptacion;
        this.porcentaje_pendiente = (this.pendiente / this.total) * 100;
        this.porcentaje_aceptacion = (this.aceptacion / this.total) * 100;
        this.porcentaje_no_acepta = (this.noAcepta / this.total) * 100;
        this.porcentaje_cumplimiento = this.porcentaje_aceptacion + this.porcentaje_no_acepta;
        this.data = [];
        this.data.push(this.aceptacion);
        this.data.push(this.noAcepta);
        this.data.push(this.pendiente);
        //console.log(this.datePersona);
        //console.log(personaPendiente);
        //console.log(encuestasRealizadas);
      } else {
        this.data = [];
      }
      this.cargarChart();
      //console.log("si  ");
      //console.log(this.datePersona);
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

}
