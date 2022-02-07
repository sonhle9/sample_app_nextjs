import {Pipe, PipeTransform} from '@angular/core';
import {FuelInCarStatus} from '../../app/stations/shared/const-var';

@Pipe({
  name: 'fuelInCarStatus',
})
export class FuelInCarStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case FuelInCarStatus.inactive:
        return 'Inactive';

      case FuelInCarStatus.active:
        return 'Active';

      case FuelInCarStatus.maintenance:
        return 'Maintenance';

      case FuelInCarStatus.comingsoon:
        return 'Coming Soon';

      default:
        return 'Unknown';
    }
  }
}
