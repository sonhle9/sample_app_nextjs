import {Pipe, PipeTransform} from '@angular/core';
import {IPaymentMethod} from '../interfaces/checkoutTransaction.interface';

@Pipe({
  name: 'checkoutTransactionPaymentMethod',
})
export class checkoutTransactionPaymentMethodPipe implements PipeTransform {
  constructor() {}

  transform(paymentMethod: IPaymentMethod): any {
    if (!paymentMethod) {
      return '';
    }

    if (
      paymentMethod.family === 'wallet' &&
      paymentMethod.type === 'setel' &&
      paymentMethod.brand === 'setel'
    ) {
      return 'Setel Wallet';
    }

    if (
      paymentMethod.family === 'wallet' &&
      paymentMethod.type === 'setel' &&
      paymentMethod.brand === 'visa'
    ) {
      return 'VISA';
    }

    if (
      paymentMethod.family === 'wallet' &&
      paymentMethod.type === 'setel' &&
      paymentMethod.brand === 'mastercard'
    ) {
      return 'MasterCard';
    }

    return paymentMethod.type;
  }
}
