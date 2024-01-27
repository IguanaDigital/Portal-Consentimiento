import { Routes } from '@angular/router';
import { LogsComponent } from './log/log.component'

export const LogsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "Logs",
        component: LogsComponent,
        data: {
          title: "Logs",
          urls: [
            { title: "Seguridad" },
            { title: "Logs" },
          ],
        },
      },
    ],
  },
];


