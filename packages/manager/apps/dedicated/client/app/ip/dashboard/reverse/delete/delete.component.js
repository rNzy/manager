import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    goBack: '<',
    ipBlock: '<',
    reverse: '<',
  },
  controller,
  template,
};
