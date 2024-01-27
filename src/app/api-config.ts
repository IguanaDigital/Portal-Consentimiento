import { environment } from "../environments/environment";

export const API_CONFIG = {
  configGeneralURL: `${environment.BASE_URL}Entity/ConfiguracionES/api/es/configuracion/modulo`,
  configGeneral: `${environment.BASE_URL}Entity/ConfiguracionES/api/es/configuracion`,
  configGeneralUpdateURL: `${environment.BASE_URL}Entity/ConfiguracionES/api/es/configuracion`,
  estructuraMenu: `${environment.BASE_URL}Entity/MenuES/api/es/menu`,
  enmascaramiento: `${environment.BASE_URL}Entity/TipoEnmascaramientoES/api/es/tipoenmascaramiento`,

  logsURL: `${environment.BASE_URL}Entity/LogES/api/es/log`,
  notificacionURL: `${environment.BASE_URL}Entity/LogES/api/es/log/notificacion`,
  enviocorreoURL: `${environment.BASE_URL}Task/EnvioCorreoTS/api/ts/enviocorreo/soporte`,

  menu: `${environment.BASE_URL}Micro/PermisoMenuMS/api/ms/permisomenu/consulta`,
  consentimiento: `${environment.BASE_URL}Entity/RegistroConsentimientoES/api/es/registroconsentimiento`,
  permisosRol: `${environment.BASE_URL}Micro/PermisoMenuMS/api/ms/permisomenu/permiso?IdRol=`,

  login: `${environment.BASE_URL}Micro/LoguearUsuarioMS/api/ms/loguearusuario`,
  Session: `${environment.BASE_URL}Entity/ParametroES/api/es/parametro/codigo/SES01`,
  CapaDeServicio: `${environment.BASE_URL}Entity/ServicioES/api/es/servicio`,
  permisos: `${environment.BASE_URL}Entity/PermisoMenuES/api/es/permisomenu`,
  procesosURL: `${environment.BASE_URL}Entity/ProcesoES/api/es/proceso`,
  permiso: `${environment.BASE_URL}Micro/PermisoMenuMS/api/ms/permisomenu/permiso`,
  plantilla: `${environment.BASE_URL}Entity/PlantillaES/api/es/plantilla`,
  EncuestaURL: `${environment.BASE_URL}Entity/EncuestaES/api/es/encuesta`,
  CampaniaURL: `${environment.BASE_URL}Entity/TipoCampaniaES/api/es/tipocampania`,
  dispositivoURL: `${environment.BASE_URL}Entity/DispositivoES/api/es/dispositivo`,
  zonaURL: `${environment.BASE_URL}Entity/ZonaES/api/es/zona`,
  haciendaURL: `${environment.BASE_URL}Entity/HaciendaES/api/es/hacienda`,
  personaURL: `${environment.BASE_URL}/Entity/PersonaES/api/es/persona`,
};
