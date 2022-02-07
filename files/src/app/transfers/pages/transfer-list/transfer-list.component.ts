import {Component, OnDestroy, OnInit} from '@angular/core';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {IMerchantRole, ITransaction} from '../../../../shared/interfaces/merchant.interface';
import {TransactionSubType, TransactionType} from '../../../../shared/enums/merchant.enum';
import {Subject} from 'rxjs';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {
  DATE_FORMAT,
  DEFAULT_DROPDOWN_VALUES,
  ORDER_DATES_FILTER,
} from '../../../stations/shared/const-var';
import * as _ from 'lodash';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {forceUpdate, formatDate, resetPagination} from '../../../../shared/helpers/common';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import moment from 'moment';
import {TransferStatus} from '../../shared/const-var';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss'],
})
export class TransferListComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ITransaction>;
  pagination: IPagination<ITransaction>;
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  readonly transactionType = TransactionType.TRANSFER;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Payments',
    },
    {
      label: 'Transfers',
    },
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

  statusText = _.mapValues(TransferStatus, (value) => _.startCase(_.lowerCase(value)));
  statuses: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    _.entries(this.statusText).map(([value, text]) => ({text, value})),
  );
  selectedStatus = this.statuses[0];

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
        status: this.selectedStatus.value,
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

  getDirectionLabel(transaction: ITransaction) {
    switch (transaction.subType) {
      case TransactionSubType.TRANSFER_MERCHANT_BONUS_WALLET:
        return 'Merchant → Customer';
      case TransactionSubType.TRANSFER_REFUND_MERCHANT_BONUS_WALLET:
        return 'Customer → Merchant';
      default:
        return undefined;
    }
  }
}
