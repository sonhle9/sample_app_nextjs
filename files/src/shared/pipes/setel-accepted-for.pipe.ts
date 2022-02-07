import {Pipe, PipeTransform} from '@angular/core';
import {SetelAcceptedFor} from '../../app/stations/shared/const-var';

@Pipe({
  name: 'setelAcceptedFor',
})
export class SetelAcceptedForPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case SetelAcceptedFor.fuel:
        return 'Fuel purchase';

      case SetelAcceptedFor.store:
        return 'Mesra store purchase';

      case SetelAcceptedFor.kiosk:
        return 'Kiosk';

      default:
        return '-';
    }
  }
}
