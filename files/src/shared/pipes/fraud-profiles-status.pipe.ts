import {Pipe, PipeTransform} from '@angular/core';
import {FraudProfilesStatus} from 'src/app/api-blacklist-service';

@Pipe({
  name: 'fraudProfilesStatus',
})
export class FraudProfilesStatusPipe implements PipeTransform {
  transform(status: FraudProfilesStatus): string {
    switch (status) {
      case FraudProfilesStatus.BLACKLISTED:
        return 'Blacklisted';
      case FraudProfilesStatus.WATCHLISTED:
        return 'Watchlisted';
      case FraudProfilesStatus.CLEARED:
        return 'Cleared';
      default:
        return status;
    }
  }
}
