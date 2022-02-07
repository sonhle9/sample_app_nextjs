import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'entries'})
export class EntriesPipe implements PipeTransform {
  transform<T>(input) {
    return Object.entries<T>(input);
  }
}
