export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.job-details.dashboard.metrics-token',
    {
      url: '/metrics',
      views: {
        modal: {
          component: 'pciProjectDataProcessingMetricsTokenModal',
        },
      },
      layout: 'modal',
      params: {
        jobId: null,
        projectId: null,
      },
      resolve: {
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        metricsToken: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getMetricsToken(projectId),
        goBack: /* @ngInject */ (showJob, jobId) => () => showJob(jobId),
      },
    },
  );
};
