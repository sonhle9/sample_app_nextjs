import {Pipe, PipeTransform} from '@angular/core';
import {AllowedFuelProducts} from '../../app/cards/shared/enums';

@Pipe({
  name: 'allowFuelProduct',
})
export class AllowFuelProductPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case AllowedFuelProducts.primax_ron95:
        return 'PETRONAS Primax RON95';

      case AllowedFuelProducts.primax_ron97:
        return 'PETRONAS Primax RON97';

      case AllowedFuelProducts.diesel:
        return 'PETRONAS Diesel';

      case AllowedFuelProducts.diesel_euro5:
        return 'PETRONAS Diesel Euro 5';

      default:
        return 'Unknown';
    }
  }
}
