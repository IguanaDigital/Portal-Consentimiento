import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from "../../authentication/login/login.service";

@Injectable({
  providedIn: "root",
})
export class ConsentimientoService {
  private consentimiento = API_CONFIG.consentimiento;
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.isAuthenticated();
  }
  isAuthenticated() {
    this.authenticationService.isAuthenticated();
  }
  getReporteConsentimiento(
    id_encuesta: string,
    id_hacienda: string
  ): Observable<any[]> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.get<any[]>(
      `${this.consentimiento}/reporte/${id_encuesta}/${id_hacienda}`,
      {
        headers: headers,
      }
    );
  }
}
