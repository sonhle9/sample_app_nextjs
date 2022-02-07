import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'lastchar',
})
export class LastCharPipe implements PipeTransform {
  transform(value: string, last: any): string {
    value = value || '';
    last = last === undefined ? last : 4;
    return value.substr(value.length - last);
  }
}
