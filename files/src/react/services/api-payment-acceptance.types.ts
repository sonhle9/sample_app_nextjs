import {IPaymentMethod} from '@setel/payment-interfaces';

export interface IMerchantMethod extends IPaymentMethod {
  companyId?: string;
  merchantId: string;
  isEnabled: boolean;
  isChangeable: boolean;
}
