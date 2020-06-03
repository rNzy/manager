import { TRACKING } from './at-internet.constants';

angular
  .module('managerApp')
  .config((atInternetConfigurationProvider) => {
    atInternetConfigurationProvider.setPrefix('cloud');
    atInternetConfigurationProvider.setConfig(TRACKING);
  })
  .run(
    /* @ngInject */ ($cookies, atInternetConfiguration) => {
      const referrerSite = $cookies.get('OrderCloud');

      if (referrerSite) {
        atInternetConfiguration.setExtraConfig({ referrerSite });
      }
    },
  );
