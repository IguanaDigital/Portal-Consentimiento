import { Injectable } from "@angular/core";
import { HttpClient, HttpParams  } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "../api-config";
import { AuthenticationService } from '../authentication/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private permisosUrl = API_CONFIG.permiso;

  constructor(private http: HttpClient,private authenticationService: AuthenticationService) { }
  
  getPermissions(User: string, url: string): Observable<any> {
    const headers = this.authenticationService.createHeaders(); 
    if (!headers) return

    let params = new HttpParams();
    params = params.append('Usuario', User);
    params = params.append('Url', url);

    return this.http.post(this.permisosUrl, null, {params , headers: headers});
  }
}



