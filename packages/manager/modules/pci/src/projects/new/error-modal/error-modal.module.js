import angular from 'angular';

import component from './error-modal.component';
import routing from './error-modal.routing';

const moduleName = 'ovhManagerPciProjectErrorModal';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectErrorModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
