import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogsComponent } from './log/log.component'
import { LogsRoutes } from "./logs.routing";
import { RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from "../shared/date-picker/date-picker.component";

import { LoadingOverlayComponent } from './log/loading-overlay.component';

@NgModule({
  declarations: [
    LogsComponent,
    LoadingOverlayComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild(LogsRoutes),
    DatePickerComponent,
    
  ],
  bootstrap:    [ LogsModule ],
  exports: [
    LogsComponent,
    
    
  ],
})
export class LogsModule {}
