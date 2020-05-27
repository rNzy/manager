import angular from 'angular';
import controller from './overTheBox-actions.controller';
import template from './overTheBox-actions.html';

const moduleName = 'ovhManagerOtbActions';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.actions', {
    url: '/actions',
    views: {
      otbView: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});

export default moduleName;
