export default class OverTheBoxActionsCtrl {
  /* @ngInject */

  constructor(
    $translate,
    $q,
    $stateParams,
    PAGINATION_PER_PAGE,
    OvhApiOverTheBoxDevice,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.PAGINATION_PER_PAGE = PAGINATION_PER_PAGE;
    this.OvhApiOverTheBoxDevice = OvhApiOverTheBoxDevice;
  }

  $onInit() {
    this.loaders = {
      init: true,
    };

    this.actionIds = [];
    this.serviceName = this.$stateParams.serviceName;
    this.filter = {
      perPage: this.PAGINATION_PER_PAGE,
    };
    this.isError = false;

    this.$q.all([this.getActions()]);
  }

  getActions() {
    this.isLoading = true;
    this.actionIds = [];
    this.isError = false;
    this.OvhApiOverTheBoxDevice.v6()
      .getActions({ serviceName: this.serviceName })
      .$promise.then((actionIds) => {
        this.actionIds = actionIds.map((actionId) => ({ id: actionId }));
      })
      .catch((error) => {
        this.isError = true;
        this.errorMessage = [
          this.$translate.instant('an_error_occured'),
          error.data.message,
        ].join(' ');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  transformItem(row) {
    this.isLoading = true;
    this.isError = false;
    return this.OvhApiOverTheBoxDevice.v6()
      .getAction({ serviceName: this.serviceName, actionId: row.id })
      .$promise.then((action) => action)
      .catch((error) => {
        this.isError = true;
        this.errorMessage = [
          this.$translate.instant('an_error_occured'),
          error.data.message,
        ].join(' ');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
