import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPagination} from '../../../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {IDropdownItem} from '../../../../../../shared/components/dropdown/dropdown.interface';
import {
  DATE_FORMAT,
  ORDER_DATES_FILTER,
  DEFAULT_DROPDOWN_VALUES,
} from '../../../../../stations/shared/const-var';
import {forceUpdate, formatDate, resetPagination} from '../../../../../../shared/helpers/common';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../../../shared/helpers/errorHandling';
import moment from 'moment';

import * as _ from 'lodash';
import {TransactionStatus} from '../../../../../../shared/enums/wallet.enum';
import {ILedgerRole} from '../../../../ledger.interface';
import {ApiLedgerService} from '../../../../../api-ledger.service';
import {LedgerAccounts} from '../../../../ledger-accounts.enum';
import {ITransaction} from '../../../../../../shared/interfaces/merchant.interface';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-ledger-adjustment-list',
  templateUrl: './ledger-adjustment-list.component.html',
  styleUrls: ['./ledger-adjustment-list.component.scss'],
})
export class LedgerAdjustmentListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ITransaction>;
  pagination: IPagination<ITransaction>;

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

  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER.slice(1, 4);
  selectedDateFilter: IDropdownItem = this.dateFilters[0];
  accountsFilter: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    Object.keys(LedgerAccounts).map((key) => ({
      text: this.titlecasePipe.transform(key),
      value: LedgerAccounts[key],
    })),
  );
  selectedAccount = this.accountsFilter[0];

  startDate: string;
  endDate: string;

  errorMessage = {
    endDate: '',
  };

  roles: ILedgerRole;

  constructor(private apiLedgerService: ApiLedgerService, private titlecasePipe: TitleCasePipe) {}

  ngOnInit() {
    this.reset();
    this.initSessionRoles();
    this.indexAdjustments();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.apiLedgerService.getRolePermissions();
  }

  indexAdjustments(loader = 'full') {
    this.pagination.items = [];
    this.loading[loader] = true;
    this.apiLedgerService
      .indexAdjustments(
        this.pagination.index,
        this.pagination.page,
        this.selectedAccount.value,
        formatDate(this.startDate),
        formatDate(this.endDate),
      )
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination.items = this._pagination.items = res.items;
          this.pagination.hideCount = true;
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
    this.indexAdjustments();
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
    this.indexAdjustments('page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexAdjustments('page');
  }

  downloadCsv = () =>
    this.apiLedgerService.downloadAdjustmentsList(
      this.selectedAccount.value,
      formatDate(this.startDate),
      formatDate(this.endDate),
    );
}
