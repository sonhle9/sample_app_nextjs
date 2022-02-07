import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'plural',
})
export class PluralPipe implements PipeTransform {
  transform(value: number, unit: string): string {
    value = +(value || 0);
    switch (unit) {
      case 'point':
        return `${value} ${unit}${value > 2 ? 's' : ''}`;
    }
    return '';
  }
}
