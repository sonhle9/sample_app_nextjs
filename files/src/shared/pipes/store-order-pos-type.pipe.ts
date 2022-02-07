import {Pipe, PipeTransform} from '@angular/core';
import {StoreOrderPosType} from '../enums/store.enum';

@Pipe({
  name: 'storeOrderPosType',
})
export class StoreOrderPosTypePipe implements PipeTransform {
  transform(value: string): any {
    value = String(value || '').toLowerCase();
    let type = value;

    switch (value) {
      case StoreOrderPosType.Sapura:
        type = 'Sapura';
        break;
      case StoreOrderPosType.Sentinel:
        type = 'Sentinel';
        break;
      case StoreOrderPosType.Setel:
        type = 'Setel';
        break;
    }

    return type || ' - ';
  }
}
