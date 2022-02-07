import {PipeTransform, Pipe} from '@angular/core';

@Pipe({
  name: 'filterArray',
  pure: false,
})
export class FilterArrayPipe implements PipeTransform {
  transform(items: any[], callback: (item: any) => boolean): any {
    if (!items || !callback) {
      return items;
    }
    return items.filter((item) => callback(item));
  }
}
