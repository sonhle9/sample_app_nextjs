import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ApiReportsService} from 'src/app/api-reports-service';
import {IUserOrderReport} from 'src/shared/interfaces/report.interface';
import {formatDate, resetPagination, forceUpdate} from 'src/shared/helpers/common';
import {IPagination} from 'src/shared/interfaces/core.interface';

@Component({
  selector: 'app-week-metric-customers',
  templateUrl: './week-metric-customers.html',
  styleUrls: ['./week-metric-customers.scss'],
})
export class WeekMetricCustomersComponent implements OnInit {
  loading = {
    full: false,
    page: false,

    get any() {
      return this.full || this.page;
    },

    stop() {
      this.full = this.page = false;
    },
  };
  allSub: Subject<any> = new Subject<any>();

  pagination: IPagination<IUserOrderReport>;

  createdUsersFrom: string;
  createdUsersTo: string;
  hasOrderFrom: boolean;
  hasOrderTo: boolean;
  repeatedOrders: boolean;
  limitOrderCount: boolean;

  private allOrders: IUserOrderReport[] = [];

  constructor(private apiReportsService: ApiReportsService) {}

  ngOnInit() {
    this.filter();
  }

  filter() {
    this.pagination = resetPagination();
    this.loading.page = true;
    this.apiReportsService
      .userOrders(
        formatDate(this.createdUsersFrom),
        formatDate(this.createdUsersTo, true),
        formatDate(this.hasOrderFrom),
        formatDate(this.hasOrderTo, true),
        this.repeatedOrders,
        this.limitOrderCount,
      )
      .pipe(takeUntil(this.allSub))
      .subscribe((metrics) => {
        this.allOrders = metrics || [];
        this.pagination = resetPagination(50, 0, this.allOrders.length);
        this.next();
        this.loading.stop();
      });
  }

  next() {
    this.pagination.index++;
    this.paginationResult();
  }

  prev() {
    this.pagination.index--;
    this.paginationResult();
  }

  paginationResult() {
    const {index, page} = this.pagination;
    const startIndex = (index - 1) * page;
    this.pagination.items = this.allOrders.slice().splice(startIndex, page);
    this.pagination = forceUpdate(this.pagination);
  }
}
