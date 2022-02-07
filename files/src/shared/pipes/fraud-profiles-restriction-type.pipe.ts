import {Pipe, PipeTransform} from '@angular/core';
import {
  FraudProfilesRestrictionType,
  IFraudProfilesRestriction,
  FraudProfilesRestrictionValue,
} from 'src/app/api-blacklist-service';

@Pipe({
  name: 'fraudProfilesRestrictionType',
})
export class FraudProfilesRestrictionTypePipe implements PipeTransform {
  transform(param: IFraudProfilesRestriction | IFraudProfilesRestriction[]): string {
    const types = [].concat(param);
    if (!types || types.length <= 0) {
      return 'None';
    }
    return types.map((e) => this.getText(e)).join(', ');
  }

  getText(restriction: IFraudProfilesRestriction): string {
    return `${this.getTypeText(restriction.type)}`;
  }

  getTypeText(type: FraudProfilesRestrictionType): string {
    switch (type) {
      case FraudProfilesRestrictionType.USER_CHARGE:
        return 'Wallet charge';
      case FraudProfilesRestrictionType.USER_TOPUP:
        return 'Wallet top-up';
      case FraudProfilesRestrictionType.USER_LOGIN:
        return 'Login';
      default:
        return type;
    }
  }

  getValueText(value: FraudProfilesRestrictionValue): string {
    switch (value) {
      case FraudProfilesRestrictionValue.BLOCK:
        return 'Block';
      case FraudProfilesRestrictionValue.LIMIT:
        return 'Limit';
      default:
        return value;
    }
  }
}
