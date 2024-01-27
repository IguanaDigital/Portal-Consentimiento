import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProcesosComponent } from './proceso/proceso.component'
import { ProcesosRoutes } from "./proceso.routing";
import { RouterModule } from "@angular/router";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { LoadingOverlayComponent } from './proceso/loading-overlay.component';

@NgModule({
    declarations: [
      ProcesosComponent,
      LoadingOverlayComponent,
      
    ],
    imports: [
      CommonModule,
      NgbModule,
      FormsModule,
      RouterModule.forChild(ProcesosRoutes),
      NgMultiSelectDropDownModule.forRoot(),
    ],
    exports: [
      ProcesosComponent,
      
    ],
  })
  export class ProcesosModule {}
  