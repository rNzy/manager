import controller from './dialplan-extension.controller';
import template from './dialplan-extension.html';

const componentName = 'diaplanExtension';

angular
  .module('managerApp')
  .component('telephonyNumberOvhPabxDialplanExtension', {
    bindings: {
      extension: '=',
    },
    require: {
      numberCtrl: '^^telephonyNumber',
      ovhPabxCtrl: '^^telephonyNumberOvhPabx',
      dialplanCtrl: '^^telephonyNumberOvhPabxDialplan',
    },
    controller,
    template,
  });

export default componentName;
