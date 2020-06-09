import angular from 'angular';

import component from './reset-kubeconfig.component';
import routing from './reset-kubeconfig.routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceResetKubeconfig';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceResetKubeconfig', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
