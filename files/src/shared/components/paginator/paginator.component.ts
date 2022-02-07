import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input()
  hasNext: boolean;

  @Input()
  hasPrev: boolean;

  @Input()
  pageSizes = [10, 25];

  @Input()
  pageSize = this.pageSizes[0];

  @Output()
  pageSizeChange = new EventEmitter<number>();

  @Output()
  next = new EventEmitter<void>();

  @Output()
  prev = new EventEmitter<void>();
}
