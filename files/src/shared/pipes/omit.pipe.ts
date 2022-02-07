import {Pipe, PipeTransform} from '@angular/core';
import {omit} from '@setel/portal-ui';

@Pipe({
  name: 'omit',
})
export class OmitPipe implements PipeTransform {
  transform<Value extends unknown, KeysToOmit extends keyof Value>(
    value: Value,
    keysToOmit: Array<KeysToOmit>,
  ): Omit<Value, KeysToOmit> {
    if (!value) {
      return value;
    }
    return omit(value, keysToOmit);
  }
}
