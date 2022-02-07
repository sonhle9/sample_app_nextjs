import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IPagination} from '../../interfaces/core.interface';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input()
  pagination: IPagination<any>;
  @Input()
  mode?: number = 0;

  @Output()
  prev: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  next: EventEmitter<any> = new EventEmitter<any>();

  get hasPrev() {
    if (!this.pagination) {
      return;
    }

    return this.pagination.index > 1;
  }

  get hasNext() {
    if (!this.pagination) {
      return;
    }

    if (this.pagination.hideCount) {
      return this.pagination.items.length > 0;
    }

    return this.pagination.index * this.pagination.page < this.pagination.max;
  }

  constructor() {}

  ngOnInit() {}

  internalPrev() {
    if (!this.hasPrev) {
      return;
    }
    this.prev.emit(true);
  }

  internalNext() {
    if (!this.hasNext) {
      return;
    }
    this.next.emit(true);
  }
}
