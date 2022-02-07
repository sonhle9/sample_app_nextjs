import {Component, OnInit, OnDestroy} from '@angular/core';
import moment from 'moment';
import {IPag} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiPaymentsService} from '../../../api-payments.service';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {resetPag, formatDate} from '../../../../shared/helpers/common';
import {PrefundingBalanceTransaction} from '../../../../shared/interfaces/prefundingBalance.interface';
import {
  ORDER_DATES_FILTER,
  DATE_FORMAT,
  UTIL_TRANSACTIONS_SEARCH_OPTIONS,
  UTIL_TRANSACTIONS_SEARCH_TYPES,
} from '../../../stations/shared/const-var';
import {ApiReportsService} from '../../../api-reports-service';
import {prefundingBalanceRole} from 'src/shared/helpers/roles.type';
import {getRolePermissions} from '../../../../shared/helpers/common';
import {AuthService} from '../../../auth.service';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {takeUntil} from 'rxjs/operators';
import {pageSizesArray} from './prefundingBalanceUtilHistory.config';

@Component({
  selector: 'app-prefunding-balance-util-history',
  templateUrl: './prefundingBalanceUtilHistory.html',
  styleUrls: ['./prefundingBalanceUtilHistory.scss'],
})
export class PrefundingBalanceUtilHistoryComponent implements OnInit, OnDestroy {
  PAGE_SIZE_LIMIT = 200;
  data: PrefundingBalanceTransaction[];
  pagination: IPag;
  columns = [
    {name: 'Created at', prop: 'createdAt', flexGrow: 2},
    {name: 'Amount', prop: 'amount', flexGrow: 0.8},
    {name: "User's email", prop: 'beneficiary.email', flexGrow: 3.5},
    {name: "User's mobile number", prop: 'beneficiary.mobile', flexGrow: 2},
    {name: 'Kiple Reference ID', prop: 'referenceId', flexGrow: 3},
  ];
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

  pageSizes = pageSizesArray;
  pageSize;

  startDate: string;
  endDate: string;
  dateTypes: IDropdownItem[] = ORDER_DATES_FILTER;
  selectedDate: IDropdownItem = this.dateTypes[0];

  searchValue: string;
  searchFilter: UTIL_TRANSACTIONS_SEARCH_TYPES;

  searchTypes: IDropdownItem[] = UTIL_TRANSACTIONS_SEARCH_OPTIONS;

  errorMessage = {
    endDate: '',
  };

  constructor(
    private paymentsService: ApiPaymentsService,
    private reportsService: ApiReportsService,
    protected authService: AuthService,
  ) {
    this.reset();
    this.pageSize = this.pageSizes[0];
  }

  getRolePermissions() {
    return getRolePermissions(this.authService, prefundingBalanceRole);
  }

  hasPermissions() {
    const permissions: any = this.getRolePermissions();

    return permissions.hasViewUtilisationHistory;
  }

  ngOnInit() {
    this.pagination.page = 1;
    this.pagination.perPage = this.pageSize.value;
    this.indexBalanceHistory();
  }

  getPerPage() {
    return this.pagination.perPage > this.PAGE_SIZE_LIMIT
      ? this.PAGE_SIZE_LIMIT
      : this.pagination.perPage;
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }

  indexBalanceHistory(loader = 'full') {
    if (!this.hasPermissions()) {
      return false;
    }
    this.loading[loader] = true;
    this.paymentsService
      .indexPrefundingBalanceUtilHistory(
        this.pagination.page,
        this.pagination.perPage,
        formatDate(this.startDate),
        formatDate(this.endDate, true),
        this.searchFilter,
        this.searchValue,
      )
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          if (res.items && res.items.length > 0) {
            this.data = res.items;
          } else {
            if (this.pagination.page > 1) {
              this.pagination.page--;
            } else {
              this.data = res.items;
            }
          }

          this.loading.stop();
        },
        (err) => {
          this.data = [];
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  nextPage() {
    if (this.loading.any) {
      return;
    }

    this.pagination.page++;
    this.indexBalanceHistory('page');
  }

  prevPage() {
    if (this.loading.any || this.pagination.page <= 1) {
      return;
    }

    this.pagination.page--;
    this.indexBalanceHistory('page');
  }

  isPrevPageDisabled() {
    return this.pagination.page <= 1;
  }

  isNextPageDisabled() {
    return this.data.length < this.pagination.perPage;
  }

  reset() {
    let defaultPageSize = 20;
    if (this.pageSize && this.pageSize.value) {
      defaultPageSize = this.pageSize.value;
    }
    this.pagination = resetPag(1, defaultPageSize);
  }

  getData() {
    return this.data;
  }

  getColumns() {
    return this.columns;
  }

  downloadCsv() {
    return this.reportsService.prefundingTransactions(
      this.pagination.page,
      this.pagination.perPage,
      formatDate(this.startDate),
      formatDate(this.endDate, true),
      this.searchFilter,
      this.searchValue,
    );
  }

  onPerPageChange() {
    this.pagination.perPage = this.pageSize.value;
    this.indexBalanceHistory();
  }

  onSearch({
    searchFilter,
    searchValue,
  }: {
    searchFilter: UTIL_TRANSACTIONS_SEARCH_TYPES;
    searchValue: string;
  }) {
    this.searchFilter = searchFilter;
    this.searchValue = searchValue;
    this.filter();
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
    this.indexBalanceHistory();
  }

  updateDate() {
    const value = this.selectedDate.value;
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

  isWarningVisible(): boolean {
    return this.data.length >= this.PAGE_SIZE_LIMIT;
  }
}
