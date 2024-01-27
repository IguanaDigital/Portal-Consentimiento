export const environment = {
  production: true,
  BASE_URL: 'https://srbp01ap00.favoritafruit.corp:10447/',
  clientId: 'd55f6fcf-0f98-4502-a52c-983688a5de90', // This is the ONLY mandatory field that you need to supply.
  authority: 'https://login.microsoftonline.com/242d51ea-ee67-47c1-9913-352e12776ebe',// Defaults to "https://login.microsoftonline.com/common"
  redirectUri: 'https://srbp01ap00.favoritafruit.corp:10448/' // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
};
