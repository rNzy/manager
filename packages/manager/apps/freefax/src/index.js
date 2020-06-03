import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerFreeFax from '@ovh-ux/manager-freefax';

import ngOvhUApp from '@ovh-ux/ng-ovh-uapp';

angular
  .module('freefaxApp', [ngOvhApiWrappers, ngOvhUApp, ovhManagerFreeFax])
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/freefax'),
  );
