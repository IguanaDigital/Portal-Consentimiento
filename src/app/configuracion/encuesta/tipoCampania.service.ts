import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { PlantillaReybanpac, Plantillas } from "../../model/plantillas";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from '../../authentication/login/login.service';

@Injectable({
  providedIn: "root",
})
export class TipoCampaniaService {
  private campania = API_CONFIG.CampaniaURL;
  menuId: string;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { this.isAuthenticated();
  }
  isAuthenticated(){
  this.authenticationService.isAuthenticated();
  }
  menu(menu: string){
    this.menuId = menu;
   }

  
  getConsultaEncuesta(): Observable<any[]> {
    const headers = null;//this.authenticationService.createHeaders(); 
    //if (!headers) return;
    return this.http.get<any[]>(this.campania, { headers: headers });
  }

}