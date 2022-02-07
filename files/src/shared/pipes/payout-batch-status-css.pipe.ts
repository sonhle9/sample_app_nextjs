import {Pipe, PipeTransform} from '@angular/core';
import {PayoutBatchStatuses} from '../../app/ledger/pages/payouts/ledger-payouts.enum';

@Pipe({
  name: 'payoutBatchStatusCss',
})
export class PayoutBatchStatusCssPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'boolean') {
      return value ? 'success' : 'fail';
    }
    value = String(value || '').toLowerCase();
    if (value === 'failed') {
      return 'fail';
    }

    if (String(value).startsWith('partial')) {
      return 'partial';
    }

    if (
      [
        PayoutBatchStatuses.PAYMENT_FILE_SUBMITTED.toLowerCase(),
        PayoutBatchStatuses.ACK_SUCCEEDED.toLowerCase(),
      ].includes(value)
    ) {
      return 'processed';
    }

    if (value === PayoutBatchStatuses.COMPLETED.toLowerCase()) {
      return 'success';
    }

    if (value === PayoutBatchStatuses.ACK_REJECTED.toLowerCase()) {
      return 'error';
    }

    if (
      value === 'error' ||
      value === 'success' ||
      value === 'cancelled' ||
      value === 'processed'
    ) {
      return value;
    }

    return 'pending';
  }
}
