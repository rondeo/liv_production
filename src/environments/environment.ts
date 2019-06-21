// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,


  appKey: 'iotm6523457',
  appSecret: '',
  Authorization: 'EA86F5C615A287C5F93C65D4D4F33S5YmyE7A7D7EE3FA27529256A66EFAB9C1',
  sentryKey: 'https://a802c6e97ddd42d494137c8711dc2d64@sentry.io/1354706',

  pageTitle: 'UE',
  dashboardEnabled: true,
  dashboardPrefix: '/dashboard',
  dashboardRoute: 'dashboard' // Used in routing. value must be environment.dashboardPrefix.replace('/', '')
};
/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
