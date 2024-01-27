import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from '../../authentication/login/login.service';
import { EnvioCorreo } from './vertical-navigation.clase';
  
  @Injectable({
    providedIn: 'root'
  })
  export class DataServiceN {
    
    private url = API_CONFIG.notificacionURL;
    private urlSoporte = API_CONFIG.enviocorreoURL;
    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  
    public consultaNotificacion(): Observable<any> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.get<any>(this.url, { headers });
    }

    //ENVIAR CORREO
    enviarCorreo(envioCorreo: EnvioCorreo): Observable<EnvioCorreo> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      //console.log(envioCorreo);
      //console.log({ headers });
      return this.http.post<EnvioCorreo>(`${this.urlSoporte}`, envioCorreo,{ headers: headers });
    }
  
  
  }
  
  

