import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import ovhPabx from './feature/ovhPabx';

import number from './telephony-group-number.component';

import './telephony-group-number.factory';

const moduleName = 'ovhTelecomTelephonyGroupNumber';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    angularTranslate,
    'oui',
    ovhPabx,
  ])
  .component('number', number);

export default moduleName;
