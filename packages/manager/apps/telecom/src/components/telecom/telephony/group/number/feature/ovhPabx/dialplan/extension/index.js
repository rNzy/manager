import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import extension from './dialplan-extension.component';
import rule from './rule';

import './edit/dialplan-extension-edit.controller';

const moduleName = 'ovhTelecomGroupNumberDialplanExtension';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    rule,
  ])
  .component('extension', extension);

export default moduleName;
