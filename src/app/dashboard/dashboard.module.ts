import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenComponent } from './resumen/resumen.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routing';
import { LoadingOverlayComponent } from './resumen/loading-overlay.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResumenComponent,
    LoadingOverlayComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    RouterModule.forChild(dashboardRoutes),
  ],
  exports:[
    ResumenComponent
  ]
})
export class DashboardModule { }
