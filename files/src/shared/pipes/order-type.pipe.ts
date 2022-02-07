import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderType',
})
export class OrderTypePipe implements PipeTransform {
  transform(value: string): string {
    value = String(value || '');

    switch (value) {
      case 'fuel':
        return 'Petrol';

      case 'store':
        return 'Store';
    }
  }
}
