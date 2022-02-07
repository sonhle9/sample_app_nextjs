import {Pipe, PipeTransform} from '@angular/core';
import {StationStatus} from '../../app/stations/shared/const-var';

@Pipe({
  name: 'stationStatus',
})
export class StationStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case StationStatus.inactive:
        return 'Inactive';

      case StationStatus.active:
        return 'Active';

      case StationStatus.maintenance:
        return 'Maintenance';

      case StationStatus.comingsoon:
        return 'Coming Soon';

      default:
        return 'Unknown';
    }
  }
}
