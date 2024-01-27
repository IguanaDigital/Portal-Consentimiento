import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificacionComponent } from './notificacion/notificacion.component'
import { LogsRoutes } from "./notificacion.routing";
import { RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from "../shared/date-picker/date-picker.component";

import { LoadingOverlayComponent } from './notificacion/loading-overlay.component';

@NgModule({
  declarations: [
    NotificacionComponent,
    LoadingOverlayComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild(LogsRoutes),
    
    
  ],
  bootstrap:    [ notificacion ],
  exports: [
    NotificacionComponent,
    
    
  ],
})
export class notificacion {}
