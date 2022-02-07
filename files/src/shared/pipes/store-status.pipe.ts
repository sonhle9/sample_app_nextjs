import {Pipe, PipeTransform} from '@angular/core';
import {StoreStatus} from '../../app/stations/shared/const-var';

@Pipe({
  name: 'storeStatus',
})
export class StoreStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case StoreStatus.inactive:
        return 'Inactive';

      case StoreStatus.active:
        return 'Active';

      case StoreStatus.maintenance:
        return 'Maintenance';

      case StoreStatus.comingsoon:
        return 'Coming Soon';

      default:
        return 'Unknown';
    }
  }
}
