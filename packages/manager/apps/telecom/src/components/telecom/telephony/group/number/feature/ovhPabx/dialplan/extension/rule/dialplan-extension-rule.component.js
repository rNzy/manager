import controller from './dialplan-extension-rule.controller';
import template from './dialplan-extension-rule.html';

const componentName = 'dialplanExtensionRule';

angular
  .module('managerApp')
  .component('telephonyNumberOvhPabxDialplanExtensionRule', {
    bindings: {
      rule: '=',
    },
    require: {
      numberCtrl: '^^telephonyNumber',
      ovhPabxCtrl: '^^telephonyNumberOvhPabx',
      dialplanCtrl: '^^telephonyNumberOvhPabxDialplan',
      extensionCtrl: '^^telephonyNumberOvhPabxDialplanExtension',
    },
    controller,
    template,
  });

export default componentName;
