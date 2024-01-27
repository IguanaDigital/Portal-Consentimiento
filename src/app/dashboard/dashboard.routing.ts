import { Routes } from '@angular/router';
import { ResumenComponent } from './resumen/resumen.component';

export const dashboardRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "dashboard",
        component: ResumenComponent,
        data: {
          title: "resumen",
          urls: [
            { title: "Dashboard" },
            { title: "Resumen" },
          ],
        },
      },
    ],
  },
];