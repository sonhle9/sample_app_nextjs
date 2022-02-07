import {Pipe, PipeTransform} from '@angular/core';
import {
  CheckoutTransactionStatus,
  CHECKOUT_TRANSACTIONS_MIX_STATUS,
} from 'src/app/stations/shared/const-var';

@Pipe({
  name: 'checkoutTransactionStatus',
})
export class checkoutTransactionStatusPipe implements PipeTransform {
  transform(transaction: {paymentIntentStatus: CheckoutTransactionStatus}): string {
    const {paymentIntentStatus} = transaction;
    return this.getType(paymentIntentStatus);
  }

  private getType(paymentIntentStatus: CheckoutTransactionStatus): string {
    const invertEnums = Object.keys(CheckoutTransactionStatus).reduce(
      (current, key) => ({...current, ...{[CheckoutTransactionStatus[key]]: key}}),
      {},
    );
    return (
      CHECKOUT_TRANSACTIONS_MIX_STATUS[invertEnums[paymentIntentStatus]] &&
      CHECKOUT_TRANSACTIONS_MIX_STATUS[invertEnums[paymentIntentStatus]].text
    );
  }
}
