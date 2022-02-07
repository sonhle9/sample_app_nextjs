import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {DATE_FORMAT, ORDER_DATES_FILTER} from '../../../stations/shared/const-var';
import {forceUpdate, formatDate, resetPagination} from '../../../../shared/helpers/common';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import moment from 'moment';
import {ITransaction} from '../../../../shared/interfaces/wallet.interface';
import {TransactionStatus, TransactionType} from '../../../../shared/enums/wallet.enum';
import {ITransactionRole} from '../../../../shared/interfaces/transaction.interface';
import {ApiWalletsService} from '../../../api-wallets.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-customer-adjustment-list',
  templateUrl: './customer-adjustment-list.component.html',
  styleUrls: ['./customer-adjustment-list.component.scss'],
})
export class CustomerAdjustmentListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ITransaction>;
  pagination: IPagination<ITransaction>;
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

  statusText = _.mapValues(TransactionStatus, (value) => _.startCase(_.lowerCase(value)));

  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER;
  selectedDateFilter: IDropdownItem = this.dateFilters[0];

  startDate: string;
  endDate: string;

  errorMessage = {
    endDate: '',
  };

  roles: ITransactionRole;

  constructor(private walletsService: ApiWalletsService) {}

  ngOnInit() {
    this.reset();
    this.initSessionRoles();
    this.indexTransactions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.walletsService.getTransactionRolePermissions();
  }

  indexTransactions(loader = 'full') {
    this.pagination.items = [];
    this.loading[loader] = true;
    this.walletsService
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
