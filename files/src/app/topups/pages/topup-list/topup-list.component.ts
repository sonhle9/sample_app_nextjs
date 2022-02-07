import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiWalletsService} from '../../../api-wallets.service';
import {formatDate} from '../../../../shared/helpers/common';
import {
  TransactionStatus,
  TransactionSubType,
  TransactionType,
  CreditCardBrand,
  CreditCardPaymentType,
  getTopUpTypeLabel,
} from '../../../../shared/enums/wallet.enum';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {
  DATE_FORMAT,
  DEFAULT_DROPDOWN_VALUES,
  ORDER_DATES_FILTER,
} from '../../../stations/shared/const-var';
import moment from 'moment';
import * as _ from 'lodash';
import {ITransaction} from '../../../../shared/interfaces/wallet.interface';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-topup-list',
  templateUrl: './topup-list.component.html',
  styleUrls: ['./topup-list.component.scss'],
})
export class TopupListComponent implements OnInit, OnDestroy {
  dataTopups: ITransaction[] = [];
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Wallet',
    },
    {
      label: 'Top-ups',
    },
  ];
  pageSizes = [5, 10, 50];

  page = 0;

  perPage = 10;

  pagination = {
    page: 0,
    perPage: 10,
  };

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

  startDate: string;
  endDate: string;

  readonly transactionType = TransactionType.TOPUP;

  dateFilters: IDropdownItem[] = ORDER_DATES_FILTER;
  selectedDateFilter: IDropdownItem = this.dateFilters[0];

  statusText = _.mapValues(TransactionStatus, (value) => _.startCase(_.lowerCase(value)));
  statuses: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    _.entries(this.statusText).map(([value, text]) => ({text, value})),
  );
  selectedStatus = this.statuses[0];

  cardBrands: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    _.entries(CreditCardBrand).map(([value, text]) => ({text, value})),
  );
  selectedCardBrand = this.cardBrands[0];

  paymentTypeText = _.mapValues(CreditCardPaymentType, (value) => _.lowerCase(value));
  paymentTypes: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    _.entries(CreditCardPaymentType).map(([value, text]) => ({text, value})),
  );
  selectedPaymentType = this.paymentTypes[0];

  total = 0;

  errorMessage = {
    endDate: '',
  };

  allSub: Subject<any> = new Subject<any>();

  constructor(private walletsService: ApiWalletsService) {
    this.loading.full = true;
  }

  ngOnInit(): void {
    this.fetchListTopupsTransaction();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
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

  filter() {
    this.errorMessage = {endDate: ''};
    const validRanges = moment(this.endDate).isSameOrAfter(this.startDate);

    if (this.endDate && this.startDate && !validRanges) {
      return (this.errorMessage = {
        endDate: 'Invalid Date Range',
      });
    }

    this.fetchListTopupsTransaction();
  }

  fetchListTopupsTransaction() {
    this.walletsService
      .indexTransactions(this.pagination.page + 1, this.pagination.perPage, {
        type: this.transactionType,
        status: this.selectedStatus.value,
        cardBrand: this.selectedCardBrand.value,
        paymentType: this.selectedPaymentType.value,
        transactionDateFrom: formatDate(this.startDate),
        transactionDateTo: formatDate(this.endDate),
      })
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.total = res.max;
          this.dataTopups = res.items;
          this.loading.stop();
        },
        (err) => {
          console.log(err);
          this.loading.stop();
        },
      );
  }

  getCardNumber(creditCard) {
    const firstSixDigits = creditCard.firstSixDigits || '******';
    const lastFourDigits = creditCard.lastFourDigits || '****';
    return `${firstSixDigits}****${lastFourDigits}`;
  }

  onPageChange($event) {
    this.pagination.page = $event.pageIndex;
    this.pagination.perPage = $event.pageSize;
    this.fetchListTopupsTransaction();
  }

  getTopUpTypeLabel(subType: TransactionSubType) {
    return getTopUpTypeLabel(subType);
  }
}
