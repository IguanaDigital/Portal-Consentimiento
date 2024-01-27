import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from '../../authentication/login/login.service';
  
  @Injectable({
    providedIn: 'root'
  })
  export class DataService {
    
    private url = API_CONFIG.logsURL;
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
  
    public consultaNotificacion(): Observable<any> {
      const headers = this.authenticationService.createHeaders();
      if (!headers) return;
      return this.http.get<any>(this.url, { headers: headers });
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
  
  

