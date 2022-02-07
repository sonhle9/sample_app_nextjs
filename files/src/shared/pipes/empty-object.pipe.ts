import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'emptyObject',
})
export class EmptyObjectPipe implements PipeTransform {
  transform<T>(value: T): T | undefined {
    if (!value) {
      return undefined;
    }

    return Object.keys(value).length === 0 ? undefined : value;
  }
}
