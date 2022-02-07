import {Pipe, PipeTransform} from '@angular/core';
import {LoyaltyTransactionTypesEnum} from '../enums/loyalty.enum';
import {ILoyaltyTransaction} from '../interfaces/loyalty.interface';

@Pipe({
  name: 'loyaltyTxnPointBalance',
})
export class LoyaltyTxnPointBalancePipe implements PipeTransform {
  transform(transaction: ILoyaltyTransaction): number {
    switch (transaction.type) {
      case LoyaltyTransactionTypesEnum.earn:
      case LoyaltyTransactionTypesEnum.redeemReversal:
        return transaction.receiverBalance;

      case LoyaltyTransactionTypesEnum.redeem:
      case LoyaltyTransactionTypesEnum.earnReversal:
        return transaction.senderBalance;
    }
  }
}
