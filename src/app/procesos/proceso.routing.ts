import { Routes } from '@angular/router';
import { ProcesosComponent } from './proceso/proceso.component'

export const ProcesosRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "procesos",
        component: ProcesosComponent,
        data: {
          title: "Procesos",
          urls: [
            { title: "Proceso Automático" },
            { title: "Procesos" },
          ],
        },
      },
    ],
  },
];