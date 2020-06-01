export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.error',
    {
      url: '/error',
      views: {
        modal: {
          component: 'pciProjectErrorModal',
        },
      },
      layout: 'modal',
      params: {
        submitLabel: null,
        submitLink: null,
        message: null,
      },
      resolve: {
        goBack: /* @ngInject */ ($state, projectId) => () =>
          $state.go('pci.projects.project', {
            projectId,
          }),

        breadcrumb: () => null,

        submitAction: /* @ngInject */ ($window, submitLink) => () =>
          $window.location.href = submitLink,

        message: /* @ngInject */ ($transition$) =>
          $transition$.params().message || null,

        submitLabel: /* @ngInject */ ($transition$) =>
          $transition$.params().submitLabel || null,

        submitLink: /* @ngInject */ ($transition$) =>
          $transition$.params().submitLink || null,
      },
    },
  );
};
