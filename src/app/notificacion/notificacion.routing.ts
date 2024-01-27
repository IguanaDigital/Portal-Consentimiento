import { Routes } from '@angular/router';
import { NotificacionComponent } from './notificacion/notificacion.component'

export const LogsRoutes: Routes = [
/*  {
    path: 'notificacion',
  
    data: {
      title: 'notificacion'
    },
    component: NotificacionComponent
  }*/
  {
    path: "",
    children: [
      {
        path: "notificacion",
        component: NotificacionComponent,
        data: {
          title: "notificacion",
          urls: [
            { title: "Notificación" },
          ],
        },
      },
    ],
  },
];


