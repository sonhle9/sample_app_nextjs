import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'activeStatus',
})
export class ActiveStatusPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Active' : 'Inactive';
  }
}
