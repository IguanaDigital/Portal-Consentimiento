import { Component, OnInit } from "@angular/core";
import { DataService } from './notificacion.service';
import { DatePipe } from '@angular/common';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { ListadoNotificacion } from "./notificacion.clase";

@Component({
  selector: "app-consultas-archivos",
  templateUrl: "./notificacion.component.html",
  styleUrls: ["./notificacion.component.scss"],
  providers: [DatePipe],
})

export class NotificacionComponent implements OnInit {

  isLoading = false;
  dataNotificacion: ListadoNotificacion[]= [];
 
  cpage = 1;
  cpageSize = 10;
  totalLengthOfCollection: number = 0;
 
  totalRegistros : number = 0;
  totalInfo: number = 0;
  totalExito: number = 0;
  totalError: number = 0;
  menuId: string;
  permisos: any;

  constructor(private Notificacion: DataService, private router: Router,) {
  }

  //Validar Sesion
  ngAfterViewChecked(): void {
    this.Notificacion.isAuthenticated();
  }
  
  async ngOnInit(): Promise<void> {
    this.Notificacion.isAuthenticated();
    this.isLoading = true;
    /*await this.getPermissions();*/ /*Borar permisos al habilitar los permisos del gsa*/  this.permisos = {"codigo": "rc_plantilla","nombre": "Plantilla","visualizar": true,"nuevo": true,"modificar": true,"eliminar": true,"exportar": true,"consulta": true,"procesar": true};
    await this.ObtieneDatosNotificacion();
    await this.obtenerTotalRegistros();
}



  getPermissions(): Promise<void> {
    return new Promise((resolve, reject) => {
      const idRol = JSON.parse(localStorage.getItem('currentUser')).rolId;
      const url = this.router.url.substring(1);
  
      this.Notificacion.getPermissions(idRol, url).subscribe(
        (data: any) => {
          this.permisos = data;
          this.menuId = data.menuId;
          this.Notificacion.menu(this.menuId);
          resolve();
        },
        (error) => {
          console.error('There was an error!', error);
          reject(error);
        }
      );
    });
  }
  async obtenerTotalRegistros(){
    this.isLoading = true;
    const consultarLogs = () => {
      return new Promise((resolve) => {
        this.Notificacion.consultaNotificacion().subscribe(
          (listLogs) => {
            this.totalRegistros = listLogs.length;

            const registrosInfo = listLogs.filter(registro => registro.tipoDeEvento === 'Informe');
            this.totalInfo = registrosInfo.length;
    
            const registrosExito = listLogs.filter(registro => registro.tipoDeEvento === 'Éxito');
            this.totalExito = registrosExito.length;
    
            const registrosError = listLogs.filter(registro => registro.tipoDeEvento === 'Error');
            this.totalError = registrosError.length;
            resolve(true)
            this.isLoading = false;
          
          },
          (error) => {
            resolve(true)
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: error.error,
            });
            this.isLoading = false;
          }
        );
      })
    }
    return consultarLogs();
  }
  
  async ObtieneDatosNotificacion(){
    this.isLoading = true;
    const consultarLogs = () => {
      return new Promise((resolve) => {
        this.Notificacion.consultaNotificacion().subscribe(
          (listNotificacion) => {
            this.dataNotificacion = listNotificacion;
            
            this.totalLengthOfCollection = this.dataNotificacion.length;
            this.isLoading = false;
            resolve(true)
            this.isLoading = false;
          
          },
          (error) => {
            resolve(true)
            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: error.error,
            });
            this.isLoading = false;
          }
        );
      })
    }
    return consultarLogs();
  }

    
}
