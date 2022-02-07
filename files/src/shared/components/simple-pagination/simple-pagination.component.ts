import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IPag} from '../../interfaces/core.interface';

@Component({
  selector: 'app-simple-pagination',
  templateUrl: './simple-pagination.component.html',
  styleUrls: ['./simple-pagination.component.scss'],
})
export class SimplePaginationComponent implements OnInit {
  @Input()
  pagination: IPag;
  @Input()
  mode?: number = 0; // for consistency
  @Input()
  disableNext?: boolean;

  @Output()
  prev: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  next: EventEmitter<any> = new EventEmitter<any>();

  get hasPrev() {
    if (!this.pagination) {
      return;
    }

    return this.pagination.page > 1;
  }

  get hasNext() {
    if (!this.pagination) {
      return;
    }
    if (this.pagination.total) {
      return this.pagination.page * this.pagination.perPage < this.pagination.total;
    }
    return this.disableNext !== undefined ? !this.disableNext : true;
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

  showCounters() {
    return this.pagination.hasOwnProperty('total');
  }
}
