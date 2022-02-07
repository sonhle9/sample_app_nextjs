import {Pipe, PipeTransform} from '@angular/core';
import {IPagination} from '../interfaces/core.interface';

@Pipe({
  name: 'paginationCount',
})
export class PaginationCountPipe implements PipeTransform {
  transform(page: IPagination<any>, mode: string | number): string {
    if (mode === 'max') {
      return `${Math.max(page.max, 0)}`;
    }

    const total = (page.items || []).length || 0;
    if (!mode) {
      return `${Math.min(total, 1)}-${total}`;
    }

    const curr = page.index;
    const max = Math.max(0, Math.min(curr * page.page, page.max));
    let min = Math.max(0, (curr - 1) * page.page);
    min = min >= max ? 0 : min + 1;

    return `${min}-${max}`;
  }
}
