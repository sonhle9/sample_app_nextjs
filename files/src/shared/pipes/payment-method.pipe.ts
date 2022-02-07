import {Pipe, PipeTransform} from '@angular/core';
import {PaymentMethod, PaymentMethodAll} from 'src/app/transactions/shared/const-var';

@Pipe({
  name: 'paymentMethod',
})
export class PaymentMethodPipe implements PipeTransform {
  transform(value: string): any {
    switch (value) {
      case PaymentMethod.WALLET:
        return 'Wallet';
      case PaymentMethod.SMARTPAY:
        return 'Smartpay';
      case PaymentMethod.VOUCHERS:
        return 'Vouchers';
      case PaymentMethodAll:
        return 'All';
      default:
        return 'Not supported';
    }
  }
}
