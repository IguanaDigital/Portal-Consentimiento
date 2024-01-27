import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { PlantillaReybanpac, Plantillas } from "../../model/plantillas";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from '../../authentication/login/login.service';

@Injectable({
  providedIn: "root",
})
export class PlantillasService {
  private plantillas = API_CONFIG.plantilla;
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

  getPlantilla(): Observable<any[]> {
    const headers = null; this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.get<any[]>(this.plantillas, { headers: headers });
  }

  getConsultaPlantilla(): Observable<any[]> {
    const apiTipoRegistro = `${API_CONFIG.plantilla}`;
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return;
    console.log("Enviando headers");
    return this.http.get<any[]>(apiTipoRegistro, { headers: headers });
  }

  createTipoArchivo(plantillas: PlantillaReybanpac): Observable<PlantillaReybanpac> {
    const headers =this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.post<PlantillaReybanpac>(`${this.plantillas}`, plantillas, { headers: headers });
  }

  updateTipoArchivo(plantillas: PlantillaReybanpac): Observable<PlantillaReybanpac> {
    const headers = null;// this.authenticationService.createHeaders(); 
    //if (!headers) return;
    return this.http.put<PlantillaReybanpac>(`${this.plantillas}`, plantillas, { headers: headers });
  }

  deleteTipoArchivo(id: number): Observable<void> {
    const headers =  this.authenticationService.createHeaders(); 
    if (!headers) return;
    return this.http.delete<void>(`${this.plantillas}/${id}`, { headers: headers });
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