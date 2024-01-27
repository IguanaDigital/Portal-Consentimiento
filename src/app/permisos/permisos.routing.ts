import { Routes } from "@angular/router";
import { PermisosComponent } from "./permisos/permisos.component";

export const PermisosRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "permisos",
        component: PermisosComponent,
        data: {
          title: "permisos",
          urls: [{ title: "Seguridad" }, { title: "Permisos" }],
        },
      },
    ],
  },
];
