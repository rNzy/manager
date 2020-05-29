export default class PciProjectNewPaymentChooseCtrl {
  constructor() {
    this.useNewPaymentMethod = false;
  }

  /*= =============================
  =            Events            =
  ============================== */

  onUseNewPaymentMethodBtnClick() {
    this.useNewPaymentMethod = !this.useNewPaymentMethod;
  }

  onChooseDefaultPaymentMethodChange() {
    this.useNewPaymentMethod = false;
    this.model.paymentMethod = null;
  }

  /*= ====  End of Events  ====== */
}
