import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'txnstatus',
})
export class TxnStatusPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Success' : 'Failed';
  }
}
