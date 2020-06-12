import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import ovhPabx from './ovh-pabx.component';
import dialplan from './dialplan';

import './ovh-pabx.factory';

const moduleName = 'ovhTelecomGroupNumberDialplan';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    dialplan,
  ])
  .component('ovhPabx', ovhPabx);

export default moduleName;
