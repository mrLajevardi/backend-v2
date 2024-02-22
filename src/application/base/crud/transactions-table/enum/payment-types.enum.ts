import { PaymentGatewayTypeEnum } from '../../../../payment/enum/payment-gateway-type.enum';

export enum PaymentTypes {
  /*
    pay by credit mean : paid invoice
  */

  PayByCredit = 0,

  /*
    pay by zarinpal mean : increase credit amount
  */

  PayByPaymentGateway = 1,

  PayToBudgetingByUserCredit = 2,

  PayToServiceByBudgeting = 3,

  PayToServiceByUserCredit = 4,

  PayToUserCreditByBudgeting = 5,

  PayToUserCreditByAdmin = 6,

  PayToBudgetingByUserCreditAutoPaid = 7,
}
