import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { API_CONFIG } from "../../api-config";
import { CapaDeServicio } from "./capaDeServicios.clase";
import { AuthenticationService } from '../../authentication/login/login.service';
  
  @Injectable({
    providedIn: 'root'
  })
  export class DataService {
    
    private url = API_CONFIG.procesosURL;
    private urlCapaServicio = API_CONFIG.CapaDeServicio+"/proceso/";
    private urlServicio = API_CONFIG.CapaDeServicio;
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
  
    //Obtener Datos SERVICIO
    obtenerDatos(): Observable<any> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.get<any>(`${this.url}`, { headers: headers });
    }

    //DATOS CAPA DE SERVICIO
    obtenerDatosCapaServicio(id : number): Observable<any> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.get<any>(this.urlCapaServicio+id , { headers: headers });
    }

     //DATOS CAPA DE SERVICIO
     obtenerDatosServicio(): Observable<any> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.get<any>(this.urlServicio, { headers: headers });
    }


    //CREAR CapaDeServicio
    crearCapaDeServicio(listado: CapaDeServicio): Observable<CapaDeServicio> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.post<CapaDeServicio>(`${this.urlServicio}`, listado, { headers: headers });
    }

    //UPDATE CapaDeServicio
    updateCapaDeServicio(listado: CapaDeServicio): Observable<CapaDeServicio> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.put<CapaDeServicio>(`${this.urlServicio}`, listado, { headers: headers });
    }
    //DELETE CapaDeServicio
    deleteCapaDeServicio(id: number): Observable<CapaDeServicio> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
    return this.http.delete<CapaDeServicio>(`${this.urlServicio}/${id}`, { headers: headers });
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
  
  

