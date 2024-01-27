import { Component, AfterViewInit, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ListadoNotificacion } from "../../notificacion/notificacion/notificacion.clase";
import { DataServiceN } from './vertical-navigation.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/login/login.service';
import { EnvioCorreo } from './vertical-navigation.clase';
declare var $: any;

@Component({
  selector: 'app-vertical-navigation',
  templateUrl: './vertical-navigation.component.html'
})
export class VerticalNavigationComponent implements AfterViewInit {

 notificacion:ListadoNotificacion= new ListadoNotificacion();
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};
  currentUser: any;
  public showSearch = false;
  
  // This is for Notifications
  soporte:EnvioCorreo= new EnvioCorreo();
  dataSoporte:EnvioCorreo[]= [];
  data: ListadoNotificacion[]= [];

  totalNotificaciones: number;
  notifications: Object[] = [
    {
     
      icon: 'fas fa-check-circle',
      title:'Event today',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      
      icon: 'fas fa-info-circle',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {

      icon: 'fas fa-exclamation-circle',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      btn: 'btn-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  }

  public languages: any[] = [{
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  },
  {
    language: 'Español',
    code: 'es',
    icon: 'es'
  },
  {
    language: 'Français',
    code: 'fr',
    icon: 'fr'
  },
  {
    language: 'German',
    code: 'de',
    icon: 'de'
  }]
  
  @ViewChild("myModalSoporte", {static: false}) myModalSoporte: TemplateRef<any>;
  constructor( private authenticationService: AuthenticationService,private modalService: NgbModal, private translate: TranslateService, private Notificacion: DataServiceN,private router: Router) {
    translate.setDefaultLang('en')
  }

  ngOnInit(): void {
    this.ObtieneDatosNotificacion().then(() => {});
    this.authenticationService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
    
   
  }

  mostrarModalSoporte( ){ 
    
    this.modalService.open(this.myModalSoporte,{
      
      centered: true,
      size: <any>"lg",
      
      scrollable: true,
      beforeDismiss: () => {
        return true;
      },
      
    });
    
    
  }

  changeLanguage(lang: any) {
    this.translate.use(lang.code)
    this.selectedLanguage = lang;
  }

  ngAfterViewInit() { }

  async ObtieneDatosNotificacion(){
    
    const consultarLogs = () => {
      return new Promise((resolve) => {
        this.Notificacion.consultaNotificacion().subscribe( 
          (listNotificacion) => {
            this.data=listNotificacion;
                     
          this.totalNotificaciones = this.data.length;
           
            resolve(true);
          },
          (error) => {
            resolve(true);
            
          }
        );
      })
    }
    //return consultarLogs();
  }

  onEnviarCorreo(){
    //const usuario = (document.getElementById('usuarioC') as HTMLInputElement).value;
    const asunto = (document.getElementById('asunto') as HTMLInputElement).value;
    const contenido = (document.getElementById('contenido') as HTMLInputElement).value;
    Swal.fire({
      text: '¿Desea Enviar el correo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b22222',
      cancelButtonColor: '#77797a',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.soporte.usuario = this.currentUser.userName;
        this.soporte.asunto = asunto;
        this.soporte.contenido = contenido;
        
        this.Notificacion.enviarCorreo(this.soporte).subscribe(
          (newTipoArchivo) => {
            this.dataSoporte[0] = newTipoArchivo;
            this.modalService.dismissAll();
            Swal.fire({
              text: 'Correo Enviado.',
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
      }
    })
  }

  goToOtherPage() {
    this.router.navigate(['/notificacion/notificacion']); // Navegar a la ruta '/other'
  }
}
