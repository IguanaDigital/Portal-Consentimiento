import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { API_CONFIG } from "../api-config";
import { AuthenticationService } from "../authentication/login/login.service";

@Injectable({
  providedIn: "root",
})
export class PersonaService {
  private personaUrl = API_CONFIG.personaURL;
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
   

  consultarRegistroEncuestaHacienda(encuesta_id:number,hacienda_id:string): Observable<any[]> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any[]>(this.personaUrl+'/dashboard/'+hacienda_id+'/'+encuesta_id, { headers: headers });
  }

  consultarRegistroHacienda(hacienda_id:string): Observable<any[]> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any[]>(this.personaUrl+'/hacienda/'+hacienda_id, { headers: headers });
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