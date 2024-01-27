// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: 'https://srbp01ap00.favoritafruit.corp:10447/',
  //BASE_URL: 'https://localhost:10447/',
  clientId: 'd55f6fcf-0f98-4502-a52c-983688a5de90', // This is the ONLY mandatory field that you need to supply.
  authority: 'https://login.microsoftonline.com/242d51ea-ee67-47c1-9913-352e12776ebe',// Defaults to "https://login.microsoftonline.com/common"
  redirectUri: 'http://localhost:4200' // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
