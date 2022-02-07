import {Pipe, PipeTransform} from '@angular/core';
import {ITransaction} from '../interfaces/transaction.interface';

@Pipe({
  name: 'topUpMethod',
})
export class TopUpMethodPipe implements PipeTransform {
  constructor() {}

  transform(transaction: ITransaction): any {
    if (!transaction) {
      return '';
    }

    switch (transaction.subtype) {
      case 'TOPUP_CREDIT_CARD':
        const cc = transaction.creditCardTransaction;
        return cc ? `${cc.cardSchema} - ${cc.lastForDigits}` : '';

      case 'TOPUP_EXTERNAL':
        return 'External top-up';

      case 'REFUND_EXTERNAL':
        return 'External top-up refund';

      case 'TOPUP_BANK_ACCOUNT':
        return 'Bank';

      case 'REDEEM_LOYALTY_POINTS':
        return 'Mesra Point Redemption';

      case 'REWARDS':
        return 'Granted Wallet Balance';
      case 'AUTO_TOPUP':
        return 'Auto Top-up';
    }

    return transaction.subtype;
  }
}
