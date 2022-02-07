import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'latLng',
})
export class LatLngPipe implements PipeTransform {
  transform(value: any): string {
    value = value || {latitude: '', longitude: ''};

    if (value.latitude === '' || value.longitude === '') {
      return '';
    }

    return `${value.latitude} , ${value.longitude}`;
  }
}
