import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'txnStatusCss',
})
export class TxnStatusCssPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'boolean') {
      return value ? 'success' : 'fail';
    }
    value = String(value || '').toLowerCase();
    if (value === 'failed') {
      return 'fail';
    }

    if (value === 'succeeded' || value === 'reconciled') {
      return 'success';
    }

    if (value === 'errored') {
      return 'error';
    }

    if (
      value === 'error' ||
      value === 'success' ||
      value === 'cancelled' ||
      value === 'processed' ||
      value === 'adjusted'
    ) {
      return value;
    }

    return 'pending';
  }
}
