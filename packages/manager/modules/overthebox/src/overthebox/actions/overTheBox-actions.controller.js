export default /* @ngInject */ function(
  $translate,
  $q,
  $stateParams,
  PAGINATION_PER_PAGE,
  OvhApiOverTheBox,
  TucToast,
) {
  const self = this;

  self.loaders = {
    init: true,
  };

  self.actionIds = [];
  self.serviceName = $stateParams.serviceName;
  self.filter = {
    perPage: PAGINATION_PER_PAGE,
  };

  self.$onInit = function $onInit() {
    $q.all([self.getActions()]);
  };

  self.getActions = function getActions() {
    self.isLoading = true;
    self.actionIds = [];
    OvhApiOverTheBox.v6()
      .getActions({ serviceName: $stateParams.serviceName })
      .$promise.then((actionIds) => {
        self.actionIds = actionIds.map((actionId) => ({ id: actionId }));
      })
      .catch((error) => {
        TucToast.error(
          [$translate.instant('an_error_occured'), error.data.message].join(
            ' ',
          ),
        );
      })
      .finally(() => {
        self.isLoading = false;
      });
  };

  self.transformItem = function transformItem(row) {
    self.isLoading = true;
    return OvhApiOverTheBox.v6()
      .getAction({ serviceName: $stateParams.serviceName, actionId: row.id })
      .$promise.then((action) => action)
      .catch((error) => {
        TucToast.error(
          [$translate.instant('an_error_occured'), error.data.message].join(
            ' ',
          ),
        );
      })
      .finally(() => {
        self.isLoading = false;
      });
  };
}
