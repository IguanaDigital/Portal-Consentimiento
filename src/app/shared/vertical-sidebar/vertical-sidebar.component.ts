import { Component ,EventEmitter, Input, Output , OnInit,Inject, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { RouteInfo } from './vertical-sidebar.metadata';
import { VerticalSidebarService } from './vertical-sidebar.service';
import { AuthenticationService } from '../../authentication/login/login.service';

import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { EventMessage, EventType,AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html'
})
export class VerticalSidebarComponent implements OnInit, OnDestroy {
  currentUser: any;
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[] = [];
  path = '';

  Name: string;
  isIframe = false;
  loginDisplay = false;
  displayedColumns: string[] = ['claim', 'value'];
  dataSource: any =[];
  private readonly _destroying$ = new Subject<void>();

  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();


  handleNotify() {
    this.notify.emit(!this.showClass);
  }

  
  constructor(
    private menuServise: VerticalSidebarService, 
    private router: Router , 
    @Inject(MSAL_GUARD_CONFIG) 
    private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadcastService: MsalBroadcastService, 
    private authService: MsalService,
    private authenticationService: AuthenticationService
    ) 
    {
    this.menuServise.items.subscribe(menuItems => {
      this.sidebarnavItems = menuItems;
      let elementoDashboard =  this.sidebarnavItems.find(m => m.title =="Dashboard");
      let path = (elementoDashboard.submenu.find(m => m.title =="Resumen")).path;
      let indice = this.sidebarnavItems.indexOf(elementoDashboard);
      this.sidebarnavItems[indice].submenu=[];
      this.sidebarnavItems[indice].path=path;
      this.sidebarnavItems[indice].class="";

      // Active menu
      const activeMenu = this.sidebarnavItems.find(m => m.submenu.find(s => s.path === this.router.url));
      if (activeMenu) {
        this.path = activeMenu.title;
        this.addExpandClass(this.path);
      }
    });
  }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
       
      });

      this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
        this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims)
      });
      this.Name = this.authService.instance.getActiveAccount()?.username;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
	
}

getClaims(claims: any) {
  this.dataSource = [
    {id: 1, claim: "Display Name", value: claims ? claims['name'] : null},
    {id: 2, claim: "User Principal Name (UPN)", value: claims ? claims['preferred_username'] : null},
    {id: 2, claim: "OID", value: claims ? claims['oid']: null}
  ];
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
  this.authenticationService.logout();
  this.authService.logout();

  //this.authService.logoutRedirect({
   // postLogoutRedirectUri: 'http://localhost:4200'
  //});
}

//cerrar() {
//  this.router.navigate(['/login']);
//}


ngOnDestroy(): void {

  this._destroying$.next(undefined);
  this._destroying$.complete();
}



setLoginDisplay() {
  this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
}


}
