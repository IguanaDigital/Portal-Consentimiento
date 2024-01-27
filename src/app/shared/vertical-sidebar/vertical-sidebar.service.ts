import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { RouteInfo } from "./vertical-sidebar.metadata";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API_CONFIG } from "../../api-config";
import { AuthenticationService } from "../../authentication/login/login.service";
import { MsalService } from "@azure/msal-angular";

@Injectable({
  providedIn: "root",
})
export class VerticalSidebarService {
  public screenWidth: any;
  public collapseSidebar: boolean = false;
  public fullScreen: boolean = false;

  private menu = API_CONFIG.menu;

  items = new BehaviorSubject<RouteInfo[]>([]);

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private authService: MsalService
  ) {
    this.getMenuItems();
  }

  getMenuItems(): void {
    const headers = this.authenticationService.createHeaders();
    if (!headers) return;
    const userId = this.authService.instance.getActiveAccount()?.username;
    if (userId) {
      const params = new HttpParams().set("Usuario", userId);
      const currentUser = localStorage.getItem("currentUser");
      const authData = JSON.parse(currentUser);
      this.items.next(authData.menu);
    }
  }
}
