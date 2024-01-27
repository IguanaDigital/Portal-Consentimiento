import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../authentication/login/login.service';
import { MsalService} from '@azure/msal-angular';

@Component({
  templateUrl: './starter.component.html',
  styleUrls: ["./starter.component.scss"],
})
export class StarterComponent implements OnInit {
  currentUser: any;
  date: Date;
  greeting: string;
  name :string;
  constructor(private authService: AuthenticationService, private authServiceMS: MsalService) { }
//Validar Sesion
ngAfterViewChecked(): void {
  this.authService.isAuthenticated();
}
  ngOnInit() {
    this.authService.isAuthenticated();
    this.name = this.authServiceMS.instance.getActiveAccount()?.username;
    this.authService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
    this.date = new Date();

    const hours = this.date.getHours();
    if (hours >= 6 && hours < 12) {
      this.greeting = 'Buenos días ';
    } else if (hours >= 12 && hours < 18) {
      this.greeting = 'Buenas tardes';
    } else {
      this.greeting = 'Buenas noches';
    }

    //this.authService.inicializarTemporizador();
  }
  
}
