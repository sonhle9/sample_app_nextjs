import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {isEmptyOrUndefined} from '../../shared/helpers/common';

@Pipe({
  name: 'myrCurrency',
})
export class MyrCurrencyPipe extends CurrencyPipe implements PipeTransform {
  // @ts-ignore
  transform(value: string = '', defaultValue: string = ''): string {
    if (defaultValue === '' && isEmptyOrUndefined(value)) {
      return 'N/A';
    }

    value = isEmptyOrUndefined(value) ? defaultValue : value;
    return super.transform(value, 'RM ', 'symbol', '0.2-2');
  }
}
