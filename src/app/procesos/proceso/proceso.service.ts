import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from "rxjs";
import { Proceso } from "./proceso.clase";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from '../../authentication/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = API_CONFIG.procesosURL;
  private urlGuardar = API_CONFIG.procesosURL;
  private urlUpdate = API_CONFIG.procesosURL;
  private urlDelete = API_CONFIG.procesosURL;
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

  obtenerDatos(): Observable<any> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any>(this.url, { headers: headers });
  }

  //GUARDAR PROCESO
  GuardarProceso(Proceso: Proceso): Observable<Proceso> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.post<Proceso>(`${this.urlGuardar}`, Proceso, { headers: headers });
  }

  //UPDATE PROCESO
  updateProceso(Proceso: Proceso): Observable<Proceso> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.put<Proceso>(`${this.urlUpdate}`, Proceso, { headers: headers });
  }

  //DELETE PROCESO
  deleteproceso(id): Observable<Proceso> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.delete<Proceso>(`${this.urlDelete}/${id}`, { headers: headers });
 }

 getPermissions(Usuario: string, url: string): Observable<any> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return

  let params = new HttpParams();
  params = params.append('Usuario', Usuario);
  params = params.append('Url', url);

  return this.http.post(this.permisosUrl, null, {params , headers: headers});
  }
}



