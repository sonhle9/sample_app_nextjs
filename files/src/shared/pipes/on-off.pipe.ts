import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'onoff',
})
export class OnOffPipe implements PipeTransform {
  transform(value: boolean): any {
    return value ? 'On' : 'Off';
  }
}
