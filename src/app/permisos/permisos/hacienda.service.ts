import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Permisos } from "./permisos.clase";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from "../../authentication/login/login.service";

@Injectable({
  providedIn: "root",
})
export class HaciendaService {
  private urlHacienda = API_CONFIG.haciendaURL;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.isAuthenticated();
  }
  isAuthenticated() {
    this.authenticationService.isAuthenticated();
  }
  menu(menu: string) {}

  //Mostrar Rol
  consultarHacienda(): Observable<any> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.get<any>(this.urlHacienda, { headers: headers });
  }

  consultarHaciendaZonaId(zona_id: number): Observable<any> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    //console.log(this.urlHacienda+"/"+zona_id);
    return this.http.get<any>(this.urlHacienda + "/zona/" + zona_id, {
      headers: headers,
    });
  }

  consultarHaciendaPorEncuestaZona(
    zona_id: string,
    encuesta_id: number
  ): Observable<any> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.get<any>(
      this.urlHacienda + "/encuesta/" + zona_id + "/" + encuesta_id,
      { headers: headers }
    );
  }
}
