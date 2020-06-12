import controller from './dialplan.controller';
import template from './dialplan.html';

const componentName = 'dialplan';

angular.module('managerApp').component('telephonyNumberOvhPabxDialplan', {
  bindings: {
    dialplan: '=telephonyNumberOvhPabxDialplan',
  },
  require: {
    numberCtrl: '^^telephonyNumber',
    ovhPabxCtrl: '^^telephonyNumberOvhPabx',
  },
  template,
  controller,
});

export default componentName;
