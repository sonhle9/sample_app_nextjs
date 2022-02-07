import {Pipe, PipeTransform} from '@angular/core';
import {PumpStatus} from '../../react/modules/stations/stations.enum';
import {IReadStation} from '../interfaces/station.interface';

@Pipe({
  name: 'pumpCount',
})
export class PumpCountPipe implements PipeTransform {
  transform(station: IReadStation): string {
    if (!station) {
      return '';
    }

    return `${station.pumps.filter((pump) => pump.status === PumpStatus.ACTIVE)}/${
      station.pumps.length
    }`;
  }
}
