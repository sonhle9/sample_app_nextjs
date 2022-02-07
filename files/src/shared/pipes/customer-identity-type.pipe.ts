import {Pipe, PipeTransform} from '@angular/core';
import {IdentityTypesEnum} from '../interfaces/customer.interface';

@Pipe({
  name: 'customerIdentityType',
})
export class CustomerIdentityTypePipe implements PipeTransform {
  transform(type?: IdentityTypesEnum): string {
    switch (type) {
      case IdentityTypesEnum.icNumber:
        return 'IC Number';

      case IdentityTypesEnum.oldIcNumber:
        return 'Old IC Number';

      case IdentityTypesEnum.passportNumber:
        return 'Passport Number';

      default:
        return '';
    }
  }
}
