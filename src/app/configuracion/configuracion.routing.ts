import { Routes } from "@angular/router";
import { PlantillasComponent } from "./plantillasComponent/plantillas.component";
import { AjusteServidorComponent } from "./ajusteservidor/ajusteservidor.component";
import { DispositivosComponent } from "./dispositivos/dispositivos.component";
import { EncuestaComponent } from "./encuesta/encuesta.component";
import { CompaniaComponent } from "./compania/compania.component";
export const CorreoRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "plantillas",
        component: PlantillasComponent,
        data: {
          title: "plantillas",
          urls: [{ title: "Configuración" }, { title: "plantillas" }],
        },
      },
      {
        path: "dispositivos",
        component: DispositivosComponent,
        data: {
          title: "dispositivos",
          urls: [{ title: "Configuración" }, { title: "dispositivos" }],
        },
      },
      {
        path: "encuesta",
        component: EncuestaComponent,
        data: {
          title: "encuesta",
          urls: [{ title: "Configuración" }, { title: "encuesta" }],
        },
      },
      {
        path: "ajusteservidor",
        component: AjusteServidorComponent,
        data: {
          title: "Ajuste de Servidor",
          urls: [
            { title: "Configuración" },
            { title: "Correo" },
            { title: "Ajuste de Servidor" },
          ],
        },
      },
      {
        path: "compania",
        component: CompaniaComponent,
      },
    ],
  },
];
