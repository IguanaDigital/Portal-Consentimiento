import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { API_CONFIG } from "../../api-config";
import { Enmascaramiento } from "./enmascaramientos.clase";
import { AuthenticationService } from '../../authentication/login/login.service';
  
  @Injectable({
    providedIn: 'root'
  })
  export class DataService {
    private url = API_CONFIG.enmascaramiento;
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
  
    //Obtener Datos Enmascaramiento
    obtenerDatos(): Observable<any> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.get<any>(this.url, { headers: headers });
    }

    //CREAR ENMASCARAMIENTO
    crearEnmascaramiento(listado: Enmascaramiento): Observable<Enmascaramiento> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.post<Enmascaramiento>(`${this.url}`, listado, { headers: headers });
    }

    //UPDATE ENMASCARAMIENTO
    updateEnmascaramiento(listado: Enmascaramiento): Observable<Enmascaramiento> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.put<Enmascaramiento>(`${this.url}`, listado, { headers: headers });
    }

    //DELETE ENMASCARAMIENTO
    deleteEnmascaramiento(id): Observable<Enmascaramiento> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.delete<Enmascaramiento>(`${this.url}/${id}`, { headers: headers });
    }

    getPermissions(idRol: number, url: string): Observable<any> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return

      let params = new HttpParams();
      params = params.append('IdRol', idRol.toString());
      params = params.append('Url', url);
  
      return this.http.post(this.permisosUrl, null, {params , headers: headers});
    }

  }
  
  

