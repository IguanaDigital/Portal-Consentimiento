import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AjusteServidorComponent } from "./ajusteservidor/ajusteservidor.component";
import { CorreoRoutes } from "./configuracion.routing";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingOverlayComponent } from "./loading-overlay.component";
import { EncuestaComponent } from "./encuesta/encuesta.component";
import { DispositivosComponent } from "./dispositivos/dispositivos.component";
import { DatePickerComponent } from "../shared/date-picker/date-picker.component";
import { PlantillasComponent } from "./plantillasComponent/plantillas.component";
import { CompaniaComponent } from "./compania/compania.component";
import { ComponentsModule } from "../component/component.module";
import { CompaniaFormComponent } from "./compania/companiaForm/companiaForm.component";

@NgModule({
  declarations: [
    AjusteServidorComponent,
    LoadingOverlayComponent,
    EncuestaComponent,
    DispositivosComponent,
    PlantillasComponent,
    CompaniaComponent,
    CompaniaFormComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    DatePickerComponent,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild(CorreoRoutes),
  ],
  exports: [DispositivosComponent, EncuestaComponent, PlantillasComponent],
})
export class ConfiguracionModule {}
