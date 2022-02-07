import {Pipe, PipeTransform} from '@angular/core';
import {
  TransactionSubType,
  TransactionType,
  TRANSACTION_MIX_TYPE,
  TRANSACTION_SUB_TYPE,
} from 'src/app/stations/shared/const-var';

@Pipe({
  name: 'txnType',
})
export class TxnTypePipe implements PipeTransform {
  transform(transaction: {subtype: TransactionSubType; type: TransactionType}): string {
    const {subtype, type} = transaction;
    return TRANSACTION_SUB_TYPE[subtype] || this.getType(type);
  }

  private getType(type: TransactionType): string {
    const invertEnums = Object.keys(TransactionType).reduce(
      (current, key) => ({...current, ...{[TransactionType[key]]: key}}),
      {},
    );
    return TRANSACTION_MIX_TYPE[invertEnums[type]] && TRANSACTION_MIX_TYPE[invertEnums[type]].text;
  }
}
