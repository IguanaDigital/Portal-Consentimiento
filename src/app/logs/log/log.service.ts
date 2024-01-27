import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from '../../authentication/login/login.service';
import { FiltroType, ListadoLogs } from "./log.clase";
  
  @Injectable({
    providedIn: 'root'
  })
  export class DataService {
    private url = API_CONFIG.logsURL;
    private urlMenu = API_CONFIG.estructuraMenu;
    private consultaURL = this.url + "/filtro";
    private consultaURLH = this.url + "/historico";
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
  
    nonNullValues(obj: Object): any {
      let result = {};
      for (let key in obj) {
        if (obj[key]) {
          result[key] = obj[key];
        }
      }
      return result;
    }
  

    public consultaFiltroLogs(filtro: FiltroType): Observable<ListadoLogs[]> {
      let params = this.nonNullValues(filtro);
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.get<ListadoLogs[]>(`${this.consultaURL}`, {
        params: params,
        responseType: "json",
        headers: headers
      });
    }
    public consultaFiltroHistorico(filtro: FiltroType): Observable<ListadoLogs[]> {
      let params = this.nonNullValues(filtro);
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.get<ListadoLogs[]>(`${this.consultaURLH}`, {
        params: params,
        responseType: "json",
        headers: headers
      });
    }
    
    obtenerDatos(tipoMenu :string): Observable<any> {
      const headers = this.authenticationService.createHeaders(); 
      if (!headers) return;
      return this.http.get<any>(this.urlMenu+'/tipoMenu/'+tipoMenu, { headers: headers });
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
  
  

