import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './choose-region.component';

const moduleName = 'enterpriseCloudDatabaseCreateChooseRegionModule';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('enterpriseCloudDatabaseCreateChooseRegion', component);

export default moduleName;
