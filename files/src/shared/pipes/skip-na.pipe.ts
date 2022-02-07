import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'skipNa',
})
export class SkipNaPipe implements PipeTransform {
  transform(value: string): string {
    return value && value === 'N/A' ? '' : value;
  }
}
