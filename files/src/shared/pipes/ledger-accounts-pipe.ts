import {Pipe, PipeTransform} from '@angular/core';
import {LedgerAccounts} from '../../app/ledger/ledger-accounts.enum';

@Pipe({
  name: 'ledgerAccounts',
})
export class LedgerAccountsPipe implements PipeTransform {
  transform(value: LedgerAccounts): string {
    switch (value) {
      case LedgerAccounts.buffer:
        return 'Buffer';

      case LedgerAccounts.collection:
        return 'Collection';

      case LedgerAccounts.customer:
        return 'Customer Aggregate';

      case LedgerAccounts.mdr:
        return 'MDR';

      case LedgerAccounts.merchant:
        return 'Merchant Aggregate';

      case LedgerAccounts.operating:
        return 'Operating';

      case LedgerAccounts.trust1:
        return 'Maybank Trust';
    }
  }
}
