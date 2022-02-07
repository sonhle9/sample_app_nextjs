import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fuelType',
})
export class FuelTypePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'DIESEL':
        return 'Dynamic Diesel';

      case 'PRIMAX_95':
        return 'PRIMAX 95';

      case 'PRIMAX_97':
        return 'PRIMAX 97';

      case 'EURO5':
        return 'Dynamic Diesel Euro 5';
    }
    return 'Unknown';
  }
}
