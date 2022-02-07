import {Pipe, PipeTransform} from '@angular/core';
import {FraudProfilesTargetType} from 'src/app/api-blacklist-service';

@Pipe({
  name: 'fraudProfilesTargetType',
})
export class FraudProfilesTargetTypePipe implements PipeTransform {
  transform(targetType: FraudProfilesTargetType): string {
    switch (targetType) {
      case FraudProfilesTargetType.USER:
        return 'Customer';
      case FraudProfilesTargetType.MERCHANT:
        return 'Merchant';
      default:
        return targetType;
    }
  }
}
