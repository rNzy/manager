import controller from './telephony-group-number.controller';
import template from './telephony-group-number.html';

const componentName = 'telephonyNumber';

angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() =>
        import(`./translations/Messages_${$translate.fallbackLanguage()}.json`),
      )
      .then((x) => x.default),
  );
  $translate.refresh();
});

angular.module('managerApp').component('telephonyNumber', {
  bindings: {
    number: '=telephonyNumber',
    featureActions: '=telephonyNumberFeatureActions',
  },
  template,
  controller,
});

export default componentName;
