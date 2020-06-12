import controller from './ovh-pabx.controller';
import template from './ovh-pabx.html';

const componentName = 'ovhPabx';

angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() =>
        import(`./translations/Messages_${$translate.fallbackLanguage()}.json`),
      )
      .then((x) => x.default),
  );

  asyncLoader.addTranslations(
    import(
      `./types/cloudHunting/translations/Messages_${$translate.use()}.json`
    )
      .catch(() =>
        import(
          `./types/cloudHunting/translations/Messages_${$translate.fallbackLanguage()}.json`
        ),
      )
      .then((x) => x.default),
  );

  asyncLoader.addTranslations(
    import(`./types/cloudIvr/translations/Messages_${$translate.use()}.json`)
      .catch(() =>
        import(
          `./types/cloudIvr/translations/Messages_${$translate.fallbackLanguage()}.json`
        ),
      )
      .then((x) => x.default),
  );

  asyncLoader.addTranslations(
    import(
      `./types/contactCenterSolutionExpert/translations/Messages_${$translate.use()}.json`
    )
      .catch(() =>
        import(
          `./types/contactCenterSolutionExpert/translations/Messages_${$translate.fallbackLanguage()}.json`
        ),
      )
      .then((x) => x.default),
  );

  $translate.refresh();
});
angular.module('managerApp').component('telephonyNumberOvhPabx', {
  require: {
    numberCtrl: '^^telephonyNumber',
  },
  template,
  controller,
});

export default componentName;
