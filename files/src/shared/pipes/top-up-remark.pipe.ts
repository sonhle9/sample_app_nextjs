import {Pipe, PipeTransform} from '@angular/core';
import {ITransaction} from '../interfaces/transaction.interface';
import {TransactionErrorPipe} from './transaction-error.pipe';

@Pipe({
  name: 'topUpRemark',
})
export class TopUpRemarkPipe extends TransactionErrorPipe implements PipeTransform {
  transform(txn: ITransaction): any {
    if (txn && txn.message) {
      return txn.message;
    }

    return super.transform(txn);
  }
}
