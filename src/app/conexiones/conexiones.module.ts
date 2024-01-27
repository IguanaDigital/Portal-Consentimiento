import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CapaDeServiciosComponent } from './conexion-CapaDeServicios/capaDeServicios.component'
import { ConexionSFTPRoutes } from "./conexiones.routing";
import { RouterModule } from "@angular/router";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { LoadingOverlayComponent } from './loading-overlay.component';

@NgModule({
  declarations: [
    CapaDeServiciosComponent,
    LoadingOverlayComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild(ConexionSFTPRoutes),
    NgMultiSelectDropDownModule.forRoot(),
  ],
  bootstrap:    [ ConexionModule ],
  exports: [
    CapaDeServiciosComponent
  ],
})
export class ConexionModule {}
