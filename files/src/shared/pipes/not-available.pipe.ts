import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'notAvailable',
})
export class NotAvailablePipe implements PipeTransform {
  transform(value: string): string {
    const formated = String(value || '').trim();
    return formated === '' ? 'N/A' : value;
  }
}
