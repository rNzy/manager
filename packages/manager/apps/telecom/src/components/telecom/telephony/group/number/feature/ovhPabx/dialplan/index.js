import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import dialplan from './dialplan.component';
import extension from './extension';

import './edit/dialplan-edit.controller';

const moduleName = 'ovhTelecomGroupNumberDialplan';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    extension,
  ])
  .component('dialplan', dialplan);

export default moduleName;
