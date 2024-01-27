import { Routes } from '@angular/router';
import { EnmascaramientoComponent } from './enmascaramientos/enmascaramientos.component'

export const EnmascaramientoRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "enmascaramiento",
        component: EnmascaramientoComponent,
        data: {
          title: "enmascaramiento",
          urls: [
            { title: "Seguridad" },
            { title: "Enmascaramiento" },
          ],
        },
      },
    ],
  },
];


