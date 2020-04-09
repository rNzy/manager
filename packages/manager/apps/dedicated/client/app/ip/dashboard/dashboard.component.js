import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  bindings: {
    goToAntihack: '<',
    goToAntispam: '<',
    goToArp: '<',
    goToBlockDelete: '<',
    goToBlockDescriptionEdit: '<',
    goToBlockMove: '<',
    goToDashboard: '<',
    goToExportCsv: '<',
    goToFirewall: '<',
    goToFirewallGame: '<',
    goToFirewallToggle: '<',
    goToMigration: '<',
    goToOrder: '<',
    goToOrderLegacy: '<',
    goToMitigationStatistics: '<',
    goToMitigationUpdate: '<',
    goToOrganisation: '<',
    goToOrganisationChange: '<',
    goToOrganisationView: '<',
    goToReverse: '<',
    goToReverseAdd: '<',
    goToReverseDelete: '<',
    goToReverseUpdate: '<',
    goToVirtualMac: '<',
    goToVirtualMacAdd: '<',
    goToVirtualMacDelete: '<',
    serviceName: '<',
  },
  controller,
  template,
};