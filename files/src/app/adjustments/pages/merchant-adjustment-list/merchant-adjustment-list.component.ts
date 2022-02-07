import {Component, OnDestroy, OnInit} from '@angular/core';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {IMerchantRole, ITransaction} from '../../../../shared/interfaces/merchant.interface';
import {TransactionType} from '../../../../shared/enums/merchant.enum';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {DATE_FORMAT, ORDER_DATES_FILTER} from '../../../stations/shared/const-var';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {forceUpdate, formatDate, resetPagination} from '../../../../shared/helpers/common';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import moment from 'moment';
import {AdjustmentStatus} from '../../shared/const-var';

@Component({
  selector: 'app-merchant-adjustment-list',
  templateUrl: './merchant-adjustment-list.component.html',
  styleUrls: ['./merchant-adjustment-list.component.scss'],
})
export class MerchantAdjustmentListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ITransaction>;
  pagination: IPagination<ITransaction>;
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  readonly transactionType = TransactionType.ADJUSTMENT;

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

  statusText = _.mapValues(AdjustmentStatus, (value) => _.startCase(_.lowerCase(value)));

  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER;
  selectedDateFilter: IDropdownItem = this.dateFilters[0];

  startDate: string;
  endDate: string;

  errorMessage = {
    endDate: '',
  };

  roles: IMerchantRole;

  constructor(private merchantService: ApiMerchantsService) {}

  ngOnInit() {
    this.reset();
    this.initSessionRoles();
    this.indexTransactions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.merchantService.getRolePermissions();
  }

  indexTransactions(loader = 'full') {
    this.pagination.items = [];
    this.loading[loader] = true;
    this.merchantService
      .indexTransactions(this.pagination.index, this.pagination.page, {
        type: this.transactionType,
        transactionDateFrom: formatDate(this.startDate),
        transactionDateTo: formatDate(this.endDate),
      })
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination.items = this._pagination.items = res.items;
          this.pagination = forceUpdate(this.pagination);
          this.loading.stop();
        },
        (err) => {
          this.pagination.items = [];
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  reset() {
    this.pagination = this._pagination = resetPagination(50);
  }

  filter() {
    this.errorMessage = {endDate: ''};
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);

    if (this.endDate && this.startDate && !validRanges) {
      return (this.errorMessage = {
        endDate: 'Invalid Date Range',
      });
    }

    this.reset();
    this.indexTransactions();
  }

  updateDateFilter() {
    const value = this.selectedDateFilter.value;
    this.endDate = moment().toISOString();
    if (value === 's') {
      return (this.startDate = this.endDate);
    }

    if (value) {
      this.startDate = moment().add(value, 'd').format(DATE_FORMAT);
      return this.filter();
    }

    this.startDate = this.endDate = '';
    return this.filter();
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexTransactions('page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexTransactions('page');
  }
}
