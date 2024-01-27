import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ConsentimientoComponent } from "./consentimiento/consentimiento.component";
import { ReportesRoutes } from "./reportes.routing";
import { ComponentsModule } from "../component/component.module";

@NgModule({
  declarations: [ConsentimientoComponent],
  imports: [ComponentsModule, RouterModule.forChild(ReportesRoutes)],
  exports: [],
})
export class ReportesModule {}
