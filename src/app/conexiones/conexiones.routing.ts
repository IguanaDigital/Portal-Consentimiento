import { Routes } from '@angular/router';

import { CapaDeServiciosComponent } from './conexion-CapaDeServicios/capaDeServicios.component'
export const ConexionSFTPRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "conexiones-CapaDeServicios",
        component: CapaDeServiciosComponent,
        data: {
          title: "conexiones-CapaDeServicios",
          urls: [
            { title: "Proceso Automático" },
            { title: "Capa de Servicios" },
          ],
        },
      },
    ],
  },
];