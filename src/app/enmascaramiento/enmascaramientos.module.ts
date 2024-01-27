import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnmascaramientoComponent } from './enmascaramientos/enmascaramientos.component'
import { EnmascaramientoRoutes } from "./enmascaramientos.routing";
import { RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from "../shared/date-picker/date-picker.component";
import { LoadingOverlayComponent } from './enmascaramientos/loading-overlay.component';



@NgModule({
  declarations: [
    EnmascaramientoComponent,
    LoadingOverlayComponent,
    
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild(EnmascaramientoRoutes),
    DatePickerComponent,
    
    
  ],
  bootstrap:    [ EnmascaramientoModule ],
  exports: [
    EnmascaramientoComponent,
    
  ],
})
export class EnmascaramientoModule {}
