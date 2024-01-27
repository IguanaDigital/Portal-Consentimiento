import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from "../../authentication/login/login.service";

@Injectable({
  providedIn: "root",
})
export class ZonaService {
  private urlZona = API_CONFIG.zonaURL;

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

  consultarZona(): Observable<any> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.get<any>(this.urlZona, { headers: headers });
  }

  consultarZonaPorEncuesta(encuesta_id: number): Observable<any> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.get<any>(this.urlZona + "/encuesta/" + encuesta_id, {
      headers: headers,
    });
  }
}
