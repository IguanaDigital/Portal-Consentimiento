import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './login.service';
import { Injectable, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { EventMessage, EventType,AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  recoverform = false;
  errorMessage: string = '';
  isLoading = false;

  isIframe = false;
  loginDisplay = false;
  displayedColumns: string[] = ['claim', 'value'];
  dataSource: any =[];

  private readonly _destroying$ = new Subject<void>();

  usuarioInactivo: EventEmitter<any> = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private Services: AuthenticationService,
    private modalService: NgbModal,
    @Inject(MSAL_GUARD_CONFIG) 
    private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadcastService: MsalBroadcastService, 
    private authService: MsalService
  ) {
    //this.authService.isAuthenticated();
    //this.loginForm = this.formBuilder.group({
    //  username: ['', Validators.required],
    //  password: ['', Validators.required]
    //});
    
  }
    
  obtenerUltimaAccion() {
    return localStorage.getItem('ultimaAccion');
  }

  setearUltimaAccion(ultimaAccion: number) {
    localStorage.setItem('ultimaAccion', String(ultimaAccion));
  }

  

  actualizarUltimaAccion() {
    this.setearUltimaAccion(Date.now());
  }

  eliminarSesion() {
  this.Services.logout();
  }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        this.isLoading = true;
        //console.log(result);
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        this.onLogin(this.authService.instance.getActiveAccount()?.username);
       
      });

      this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
        this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims);
      });

    //this.loginForm = this.formBuilder.group({
    //  username: ['', Validators.required],
    //  password: ['', Validators.required]
    //});
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();

    this._destroying$.next(undefined);
    this._destroying$.complete();
    debugger
  }

  showRecoverForm() {
    this.recoverform = !this.recoverform;
  }

  async onLogin(username:string): Promise<void> {
    this.isLoading = true;
    

    try {
      const response = await this.Services.login2(username, '').toPromise();
      if (response.codigo === 400) {
        throw new Error(response.descripcion);
        this.logout();
      }
      this.redirectToWelcome();
    } catch (errorMsg) {
      console.error('Hubo un error durante el proceso de inicio de sesión', errorMsg);
      Swal.fire({
        title: errorMsg.message,
        icon: 'error',
        confirmButtonColor: '#d33',
      });
      this.errorMessage = errorMsg.message;
      console.log("No respondio el login");
      this.logout();
    } finally {
      this.isLoading = false;
    }
  }

  redirectToWelcome() {
    console.log("estamos redireccionando al welcome")
    this.router.navigateByUrl('/welcome');
  }

  login() {
    this.isLoading = true;
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
        } else {
          this.authService.loginPopup()
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
            });
      }
    } else {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  logout() {
    //this.Services.logout();
    //this.authService.logout();
  
    //this.authService.logoutRedirect({
    //  postLogoutRedirectUri: 'http://localhost:4200'
    //});
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: "/"
      });
    }
    else{
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/'
    });

  }
  }

  
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getClaims(claims: any) {
    this.dataSource = [
      {id: 1, claim: "Display Name", value: claims ? claims['name'] : null},
      {id: 2, claim: "User Principal Name (UPN)", value: claims ? claims['preferred_username'] : null},
      {id: 2, claim: "OID", value: claims ? claims['oid']: null}
    ];
  }
}