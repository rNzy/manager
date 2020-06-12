import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import extensionRule from './dialplan-extension-rule.component';

import './edit/dialplan-extension-rule-edit.controller';

const moduleName = 'ovhTelecomGroupNumberExtensionRule';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
  ])
  .component('extensionRule', extensionRule);

export default moduleName;
