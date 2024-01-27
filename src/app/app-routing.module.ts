import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { BrowserUtils } from "@azure/msal-browser";
import { FullComponent } from "./layouts/full/full.component";
import { BlankComponent } from "./layouts/blank/blank.component";
import { LoginComponent } from "./authentication/login/login.component";
import { MsalGuard } from "@azure/msal-angular";

export const Approutes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "",
    component: FullComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: "notificacion",
        loadChildren: () =>
          import("./notificacion/notificacion.module").then(
            (m) => m.notificacion
          ),
      },
      {
        path: "permisos",
        loadChildren: () =>
          import("./permisos/permisos.module").then((m) => m.PermisosModule),
      },
      {
        path: "logs",
        loadChildren: () =>
          import("./logs/logs.module").then((m) => m.LogsModule),
      },
      {
        path: "enmascaramiento",
        loadChildren: () =>
          import("./enmascaramiento/enmascaramientos.module").then(
            (m) => m.EnmascaramientoModule
          ),
      },
      {
        path: "conexiones",
        loadChildren: () =>
          import("./conexiones/conexiones.module").then(
            (m) => m.ConexionModule
          ),
      },
      {
        path: "procesos",
        loadChildren: () =>
          import("./procesos/proceso.module").then((m) => m.ProcesosModule),
      },
      {
        path: "welcome",
        loadChildren: () =>
          import("./starter/starter.module").then((m) => m.StarterModule),
      },
      {
        path: "component",
        loadChildren: () =>
          import("./component/component.module").then(
            (m) => m.ComponentsModule
          ),
      },
      {
        path: "extra-component",
        loadChildren: () =>
          import("./extra-component/extra-component.module").then(
            (m) => m.ExtraComponentModule
          ),
      },
      {
        path: "configuracion",
        loadChildren: () =>
          import("./configuracion/configuracion.module").then(
            (m) => m.ConfiguracionModule
          ),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "reportes",
        loadChildren: () =>
          import("./reportes/reportes.module").then((m) => m.ReportesModule),
      },
    ],
  },
  {
    path: "",
    component: BlankComponent,
    children: [
      {
        path: "authentication",
        loadChildren: () =>
          import("./authentication/authentication.module").then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  { path: "**", redirectTo: "/" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(Approutes, {
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? "enabledNonBlocking"
          : "disabled", // Set to enabledBlocking to use Angular Universal
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
