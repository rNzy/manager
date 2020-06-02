import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import component from './overTheBox-actions.component';
import routing from './overTheBox-actions.routing';

const moduleName = 'ovhManagerOtbActions';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter])
  .component('overTheBoxActions', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
