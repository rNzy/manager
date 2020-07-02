import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';
import sortBy from 'lodash/sortBy';

angular.module('managerApp').controller(
  'DialplanExtensionRuleEditCtrl',
  class DialplanExtensionRuleEditCtrl {
    constructor($scope, $q, $filter, $translate, TelephonyMediator, TucToast) {
      this.$scope = $scope;
      this.$q = $q;
      this.$filter = $filter;
      this.$translate = $translate;
      this.TelephonyMediator = TelephonyMediator;
      this.TucToast = TucToast;

      this.loading = {
        init: false,
      };

      this.state = {
        collapse: false,
      };

      this.parentCtrl = null;
      this.ovhPabx = null;
      this.rule = null;
      this.availableActions = null;
      this.groups = null;
    }

    $onInit() {
      this.loading.init = true;

      this.parentCtrl = this.$scope.$parent.$ctrl;

      // get rule
      this.rule = this.parentCtrl.rule || this.parentCtrl.dialplanRule;

      // set ovh pabx ref
      this.ovhPabx = this.parentCtrl.numberCtrl.number.feature;

      // start rule edition
      this.rule.startEdition();

      // get available actions
      return this.TelephonyMediator.getApiModelEnum(
        'telephony.OvhPabxDialplanExtensionRuleActionEnum',
      )
        .then((enumValues) => {
          this.availableActions = map(
            filter(enumValues, (enumVal) => {
              if (this.ovhPabx.featureType === 'cloudIvr') {
                return enumVal !== 'hunting' && enumVal !== 'tts';
              }
              if (!this.ovhPabx.isCcs) {
                return enumVal !== 'ivr' && enumVal !== 'tts';
              }
              if (this.ovhPabx.featureType === 'cloudHunting') {
                return enumVal !== 'ivr';
              }
              return true;
            }),
            (enumVal) => ({
              value: enumVal,
              label: this.$translate.instant(
                `telephony_number_feature_ovh_pabx_step_rule_${snakeCase(
                  enumVal,
                )}`,
              ),
              explain: this.$translate.instant(
                `telephony_number_feature_ovh_pabx_step_rule_${snakeCase(
                  enumVal,
                )}_explain`,
              ),
            }),
          );

          // sort and filter groups and reject groups that don't have any service
          // used for voicemail selection
          this.groups = sortBy(
            filter(
              this.TelephonyMediator.groups,
              (group) => group.getAllServices().length > 0,
            ),
            (group) => group.getDisplayedName(),
          );
        })
        .finally(() => {
          this.loading.init = false;
        });
    }

    $onDestroy() {
      if (this.rule && !this.parentCtrl.isLoading()) {
        this.rule.stopEdition(true);
      }
    }

    isRuleValid() {
      switch (this.rule.getActionFamily()) {
        case 'playback':
        case 'voicemail':
        case 'ivr':
        case 'hunting':
        case 'tts':
          return this.rule.actionParam;
        default:
          return true;
      }
    }

    isFormValid() {
      const ttsForm = get(this.extensionRuleForm, '$ctrl.ttsCreateForm');
      if (ttsForm) {
        return ttsForm.$dirty ? this.extensionRuleForm.$valid : true;
      }
      return this.extensionRuleForm.$valid;
    }

    /**
     *  @todo refactor with service choice popover
     */
    static getServiceType(service) {
      if (service.serviceType === 'alias') {
        return 'number';
      }
      if (!service.isFax && service.isTrunk && service.isTrunk()) {
        return 'trunk';
      }
      if (service.isFax) {
        return 'fax';
      }
      return service.isPlugNFax ? 'plug_fax' : 'line';
    }

    /**
     *  @todo refactor with service choice popover
     */
    static getServiceDisplayedName(service, isGroup) {
      if (isGroup) {
        return service.description &&
          service.description !== service.billingAccount
          ? `${service.description} - ${service.billingAccount}`
          : service.billingAccount;
      }
      return service.description && service.description !== service.serviceName
        ? `${service.description} - ${service.serviceName}`
        : service.serviceName;
    }

    /**
     *  @todo refactor with service choice popover
     */
    getServiceGroupName(service) {
      return this.getServiceDisplayedName(
        find(this.TelephonyMediator.groups, {
          billingAccount: service.billingAccount,
        }),
        true,
      );
    }

    /* ----------  Voicemail selection  ---------- */

    static filterGroupServices(group) {
      return [].concat(group.lines, group.fax);
    }

    static filterDisplayedGroup(group) {
      const model = {
        search: '',
      };
      return filter('tucPropsFilter')(
        DialplanExtensionRuleEditCtrl.filterGroupServices(group),
        {
          serviceName: model.search,
          description: model.search,
        },
      ).length;
    }

    /* ----------  ACTION CHOICE   ----------*/

    onActionChangeClick() {
      this.parentCtrl.popoverStatus.rightPage = 'actions';
      this.parentCtrl.popoverStatus.move = true;
    }

    onRuleActionChange() {
      this.parentCtrl.popoverStatus.move = false;
      this.rule.actionParam = '';
    }

    /* ----------  PLAYBACK ACTIONS  ----------*/

    onPlaybackActionParamButtonClick() {
      this.parentCtrl.popoverStatus.rightPage = 'playback';
      this.parentCtrl.popoverStatus.move = true;
    }

    onSoundSelected() {
      this.parentCtrl.popoverStatus.move = false;
    }

    /* ----------  VOICEMAIL ACTIONS  ----------*/

    onVoicemailActionParamButtonClick() {
      this.parentCtrl.popoverStatus.rightPage = 'voicemail';
      this.parentCtrl.popoverStatus.move = true;
    }

    onVoicemailActionParamChange(service) {
      this.parentCtrl.popoverStatus.move = false;
      this.rule.actionParamInfos = service;
    }

    /* ----------  IVR ACTIONS  ----------*/

    onIvrActionParamButtonClick() {
      this.parentCtrl.popoverStatus.rightPage = 'ivr';
      this.parentCtrl.popoverStatus.move = true;
    }

    onIvrMenuSelectedChange(menu) {
      if (menu) {
        this.parentCtrl.popoverStatus.move = false;
      }
    }

    onAddIvrMenuButtonClick() {
      // close popover
      this.parentCtrl.popoverStatus.isOpen = false;

      // create sub menu for menu entry
      this.rule.ivrMenu = this.ovhPabx.addMenu({
        name: this.$translate.instant(
          'telephony_number_feature_ovh_pabx_step_rule_ivr_menu_add_menu_new_name',
          {
            index: this.ovhPabx.menus.length + 1,
          },
        ),
        oldParent: angular.copy(this.rule.saveForEdition),
        status: 'DRAFT',
      });

      // stop edition of menu entry
      this.rule.stopEdition();
    }

    /* ----------  HUNTING  ----------*/

    onHuntingActionParamButtonClick() {
      this.parentCtrl.popoverStatus.rightPage = 'hunting';
      this.parentCtrl.popoverStatus.move = true;
    }

    /* ----------  TTS  ----------*/

    onTtsActionParamButtonClick() {
      this.parentCtrl.popoverStatus.rightPage = 'tts';
      this.parentCtrl.popoverStatus.move = true;
    }

    onAddTtsButtonClick() {
      this.state.collapse = true;
    }

    onTtsCreationCancel() {
      this.state.collapse = false;
    }

    onTtsCreationSuccess(tts) {
      this.rule.actionParam = tts.id;
      this.state.collapse = false;
      this.parentCtrl.popoverStatus.move = false;
    }

    /* ----------  FOOTER ACTIONS  ----------*/

    onValidateBtnClick() {
      const actionPromise =
        this.rule.status === 'DRAFT' ? this.rule.create() : this.rule.save();

      this.parentCtrl.popoverStatus.isOpen = false;

      return actionPromise
        .then(() => {
          this.rule.stopEdition();
        })
        .catch((error) => {
          const errorTranslationKey =
            this.rule.status === 'DRAFT'
              ? 'telephony_number_feature_ovh_pabx_step_rule_create_error'
              : 'telephony_number_feature_ovh_pabx_step_rule_edit_error';
          this.TucToast.error(
            [
              this.$translate.instant(errorTranslationKey),
              get(error, 'data.message') || '',
            ].join(' '),
          );
          return this.$q.reject(error);
        });
    }

    onCancelBtnClick() {
      this.parentCtrl.popoverStatus.isOpen = false;
      this.parentCtrl.popoverStatus.move = false;

      if (this.rule.status === 'DRAFT') {
        this.parentCtrl.extensionCtrl.extension.removeRule(this.rule);

        // check for collapsing or not the rules into extension component view
        this.parentCtrl.extensionCtrl.checkForDisplayHelpers();
      }
    }
  },
);
