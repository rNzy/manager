import routing from './zone.routing';

import zoneActivate from './activate';
import detach from './detach/detach.module';

const moduleName = 'ovhManagerWebDomainZone';

angular
  .module(moduleName, [zoneActivate, detach])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
