import angular from 'angular';
import 'angular-translate';

import 'ovh-ui-angular';
import 'ovh-api-services';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';

import component from './component';

import './list.scss';

const moduleName = 'ovhManagerNavbarNotificationsList';

angular
  .module(moduleName, ['oui', 'ovhManagerCore', 'pascalprecht.translate'])
  .component('navbarNotificationsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
