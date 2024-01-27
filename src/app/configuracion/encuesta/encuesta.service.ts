import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from "../../authentication/login/login.service";
import { Encuestas } from "src/app/model/encuesta";

@Injectable({
  providedIn: "root",
})
export class EncuestaService {
  private encuestas = API_CONFIG.EncuestaURL;
  private permisosUrl = API_CONFIG.permiso;
  menuId: string;
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.isAuthenticated();
  }
  isAuthenticated() {
    this.authenticationService.isAuthenticated();
  }
  menu(menu: string) {
    this.menuId = menu;
  }

  getPlantilla(): Observable<any[]> {
    const headers = null;
    this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.get<any[]>(this.encuestas, { headers: headers });
  }

  getConsultaEncuesta(): Observable<any[]> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.get<any[]>(this.encuestas, { headers: headers });
  }

  createEncuesta(encuesta: Encuestas): Observable<Encuestas> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.post<Encuestas>(`${this.encuestas}`, encuesta, {
      headers: headers,
    });
  }

  updateTipoArchivo(encuesta: Encuestas): Observable<Encuestas> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.put<Encuestas>(`${this.encuestas}`, encuesta, {
      headers: headers,
    });
  }

  deleteEncuesta(id: number): Observable<void> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    return this.http.delete<void>(`${this.encuestas}/${id}`, {
      headers: headers,
    });
  }

  getPermissions(name: string, url: string): Observable<any> {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;

    let params = new HttpParams();
    params = params.append("Usuario", name);
    params = params.append("Url", url);

    return this.http.post(this.permisosUrl, null, { params, headers: headers });
  }
}
