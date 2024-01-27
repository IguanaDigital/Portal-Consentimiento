import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from "../../api-config";
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  private apiTipoRegistro = `${API_CONFIG.login}`;
  private apiSession = `${API_CONFIG.Session}`;
 
  login2(username: string, password: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Canal': 'Web'
    });
    const options = { headers: headers };
    return this.http.post<any>(this.apiTipoRegistro, { usuario:username, clave:password }, options)
      .pipe(
        tap(user => {
          //console.log(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          
          //console.log("estamos redireccionando al welcome")
          //this.router.navigateByUrl('/welcome');
        }),
        catchError(error => {
          let errorMsg = '';

          // Si el servidor está caído
          if (error.error instanceof ErrorEvent) {
            errorMsg = 'El servicio no está disponible en este momento. Por favor, intenta más tarde.';
          }
          // Si es un error de autenticación
          else if (error.status === 401) {
            errorMsg = 'Nombre de usuario o contraseña incorrectos';
          }
          // Otros errores
          else {
            errorMsg = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
          }

          console.error('Hubo un error durante el proceso de inicio de sesión', errorMsg);
          return throwError(errorMsg);
        })
      );
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getSessionDuration(): Observable<number> {
    const headers = this.createHeaders();
    if (!headers) return;
    return this.http.get<any>(this.apiSession, { headers: headers }).pipe(
      map(array => Number(array.valor))
    );
  }
  public isAuthenticated(): void {
    //const currentUser = localStorage.getItem('currentUser');
    //if (currentUser) {
    //  const currentUserlocal = this.currentUserValue;
//
    //  if (currentUserlocal != null && currentUserlocal.userName != JSON.parse(currentUser).userName) {
    //    window.location.replace('/welcome');
    //  }
//
    //  if (this.router.url === '/login') {
    //    this.router.navigate(['/welcome']);
    //  }
    //}
    //else {
    //  if (this.router.url != '/login' && this.router.url != '/') {
    //    // Si no está logueado redirige a página de login
    //    this.router.navigate(['/login']);
    //    //window.location.href = '/login';
    //  }
    //}
  }


  createHeaders(): HttpHeaders { //funcion global para el headers
    this.isAuthenticated();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const authData = JSON.parse(currentUser);
      const token = authData ? authData.token : '';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Sesion': currentUser,
        'Authorization': `Bearer ${token}`
      });
      console.log("retorna headers");
      //console.log(headers);
      return headers;

    }
    else {
      console.log('No hay un usuario actual');
      return null;
    }
  }

 

  createHeadersNotJson(): HttpHeaders { //funcion global para el headers
    this.isAuthenticated();
    const currentUser = localStorage.getItem('currentUser');
    const authData = JSON.parse(currentUser);
    const token = authData ? authData.token : '';

    if (!currentUser || !token) {
      console.error('No hay un usuario actual');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Sesion': currentUser,
    });

    return headers;
  }

  inicializarTemporizador() {
    this.getSessionDuration().subscribe((sessionDuration: any) => {
      let sessionDurationMs = sessionDuration * 60 * 1000; // convierte minutos a milisegundos
      let inactividad = () => {
        let tiempoActual = Date.now();
        let ultimaAccion = localStorage.getItem('ultimaAccion');
        if (ultimaAccion) {
          let tiempoUltimaAccion = Number(localStorage.getItem('ultimaAccion'));

          if (tiempoActual - tiempoUltimaAccion > sessionDurationMs) {
            this.logout();
            clearInterval(intervalID);
            //this.router.navigate(['/login']);
          }
        }
        else {
          this.logout();
          clearInterval(intervalID);
          //this.router.navigate(['/login']);
        }
      }

      let intervalID = setInterval(inactividad, 1000);//Se ejecuta cada Minuto.


    });
  }

}