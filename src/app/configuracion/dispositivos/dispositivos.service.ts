import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { PlantillaReybanpac, Plantillas } from "../../model/plantillas";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from '../../authentication/login/login.service';
import { PermisoDispositivo } from "src/app/model/permisoDispositivo";
import { Dispositivos } from "src/app/model/dispositivo";

@Injectable({
  providedIn: "root",
})
export class DispositivoService {
  private dispositivoUrl = API_CONFIG.dispositivoURL;
  private permisosUrl = API_CONFIG.permiso;
  menuId: string;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { this.isAuthenticated();
  }
  isAuthenticated(){
  this.authenticationService.isAuthenticated();
  }
  menu(menu: string){
    this.menuId = menu;
   }

  
  getConsultaDispositivos(): Observable<any[]> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any[]>(this.dispositivoUrl, { headers: headers });
  }

  getConsultaDispositivosPorEncuesta(encuesta_id:number): Observable<any[]> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any[]>(this.dispositivoUrl+"/encuesta/"+encuesta_id, { headers: headers });
  }

  actualizarDispositivo(permiso: Dispositivos): Observable<Dispositivos> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.put<Dispositivos>(this.dispositivoUrl, permiso, { headers: headers });
  }

  deleteDispositivo(id: number): Observable<void> {
    const headers =  this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.delete<void>(`${this.dispositivoUrl}/${id}`, { headers: headers });
  }

  consultaPermisos(): Observable<any[]> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any[]>(this.dispositivoUrl, { headers: headers });
  }

  consultaPermisosIdentificador( identificador:string): Observable<any[]> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any[]>(this.dispositivoUrl+"/permiso/"+identificador, { headers: headers });
  }

  consultaPermisosEncuestaDispositivo(encuesta_id:number, dispositivo_id:number): Observable<any[]> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any[]>(this.dispositivoUrl+"/permiso/"+encuesta_id+"/"+dispositivo_id, { headers: headers });
  }

  createPermiso(permiso: PermisoDispositivo): Observable<PermisoDispositivo> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.post<PermisoDispositivo>(`${this.dispositivoUrl}`+'/permiso', permiso, { headers: headers });
  }

  actualizarPermiso(permiso: PermisoDispositivo): Observable<PermisoDispositivo> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.put<PermisoDispositivo>(`${this.dispositivoUrl}`+'/permiso', permiso, { headers: headers });
  }

  deleteDispositivoPermiso(id: number): Observable<void> {
    const headers =  this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.delete<void>(`${this.dispositivoUrl}/permiso/${id}`, { headers: headers });
  }

  getPermissions(name: string, url: string): Observable<any> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return

    let params = new HttpParams();
    params = params.append('Usuario', name);
    params = params.append('Url', url);

    return this.http.post(this.permisosUrl, null, {params , headers: headers});
  }
}