import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PermisosComponent } from "./permisos/permisos.component";
import { PermisosRoutes } from "./permisos.routing";
import { RouterModule } from "@angular/router";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { LoadingOverlayComponent } from "./permisos/loading-overlay.component";

@NgModule({
  declarations: [PermisosComponent, LoadingOverlayComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule.forChild(PermisosRoutes),
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports: [PermisosComponent],
})
export class PermisosModule {}
