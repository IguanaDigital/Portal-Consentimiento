import { Component, HostListener } from '@angular/core';
import { LoginComponent } from "./authentication/login/login.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private loginComponent: LoginComponent) {
    this.loginComponent.usuarioInactivo.subscribe(() => {
      this.loginComponent.eliminarSesion();
    });
  }

  @HostListener('window:mousemove')
  @HostListener('window:click')
  @HostListener('window:keypress')
  @HostListener('window:scroll')
  actualizarActividad() {
    this.loginComponent.actualizarUltimaAccion();
  }
}