export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.reset-kubeconfig',
    {
      url: '/reset-kubeconfig',
      params: {
        clusterStatus: null,
      },
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceResetKubeconfig',
        },
      },
      layout: 'modal',
      resolve: {
        clusterStatus: /* @ngInject */ ($transition$) => {
          return $transition$.params().clusterStatus;
        },
        goBack: /* @ngInject */ (goToKubernetesDetails) =>
          goToKubernetesDetails,
        breadcrumb: () => null,
      },
    },
  );
};
