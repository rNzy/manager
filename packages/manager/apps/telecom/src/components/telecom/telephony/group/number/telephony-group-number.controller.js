import {
  TELPHONY_NUMBER_JSPLUMB_INSTANCE_OPTIONS,
  TELEPHONY_NUMBER_JSPLUMB_ENDPOINTS_OPTIONS,
  TELEPHONY_NUMBER_JSPLUMB_CONNECTIONS_OPTIONS,
} from './telephony-group-number.constant';

export default class TelephonyNumberCtrl {
  constructor(
    /* @ngInject */
    $q,
    $translate,
    $translatePartialLoader,
    tucJsPlumbService,
    TucToast,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$translatePartialLoader = $translatePartialLoader;
    this.tucJsPlumbService = tucJsPlumbService;
    this.TucToast = TucToast;
    this.jsPlumbInstanceOptions = TELPHONY_NUMBER_JSPLUMB_INSTANCE_OPTIONS;
    this.jsPlumbEndpointsOptions = TELEPHONY_NUMBER_JSPLUMB_ENDPOINTS_OPTIONS;
    this.jsPlumbConnectionsOptions = TELEPHONY_NUMBER_JSPLUMB_CONNECTIONS_OPTIONS;
  }

  $onInit() {
    this.loading = {
      init: true,
      feature: false,
      translations: false,
      save: false,
    };

    this.saveFeature = angular.noop;
    this.jsPlumbInstance = null;

    this.verticalLayout = true;

    this.container = document.getElementsByClassName('group-number-container');

    return this.$q
      .all([this.getTranslations(), this.tucJsPlumbService.initJsPlumb()])
      .finally(() => {
        this.loading.init = false;
      });
  }

  $onDestroy() {
    this.number.stopEdition(true, true);
  }

  saveNumber() {
    this.loading.save = true;

    if (this.number.getFeatureFamily() === 'ovhPabx') {
      return this.$q.when(this.number);
    }

    return this.number
      .save()
      .then(() => {
        // number is saved - stop its edition only
        this.number.stopEdition().startEdition();

        // resolve save defered to tell feature sub component to launch feature save
        return this.saveFeature();
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isLoading = false;
      });
  }

  getTranslations() {
    this.loading.translations = true;

    this.$translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number',
    );
    if (this.number.getFeatureFamily() === 'conference') {
      this.$translatePartialLoader.addPart(
        '../components/telecom/telephony/group/number/feature/conference',
      );
    }
    return this.$translate.refresh().finally(() => {
      this.loading.translations = false;
    });
  }

  changeCcsLayout() {
    if (this.verticalLayout) {
      this.container[0].classList.add('horizontal-layout');
      this.container[0].classList.remove('vertical-layout');
      this.verticalLayout = false;
    } else {
      this.container[0].classList.remove('horizontal-layout');
      this.container[0].classList.add('vertical-layout');
      this.verticalLayout = true;
    }
  }
}
