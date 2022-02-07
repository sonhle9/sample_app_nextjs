import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'prefix',
})
export class PrefixPipe implements PipeTransform {
  transform(value: any, prefix?: string): any {
    if (value === '' || value === null || value === undefined) {
      return '';
    }

    return `${prefix}${value}`;
  }
}
