import {Pipe, PipeTransform} from '@angular/core';
import {IError} from '../interfaces/transaction.interface';

@Pipe({
  name: 'txnErrorMessage',
})
export class TxnErrorMessagePipe implements PipeTransform {
  transform(err: IError): any {
    if (!err) {
      return '';
    }

    if (!err.code && !err.description) {
      return '';
    }

    return `${err.code} - ${err.description}`;
  }
}
