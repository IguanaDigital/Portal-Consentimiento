import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from "rxjs";
import { Permisos } from "./permisos.clase";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from '../../authentication/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
private url = API_CONFIG.permisosRol;
  private urlUpdate = API_CONFIG.permisos;
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

  //DATOS PERMISOS
  obtenerDatosPermisos(id : number): Observable<any> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.post<any>(this.url+id, {}, { headers: headers });
}

  //UPDATE PERMISOS
 
  updateRecords(records: any[]) {
    const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
    return this.http.post(`${this.urlUpdate}`, records, { headers: headers });
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



