import {Component, OnDestroy, OnInit} from '@angular/core';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {
  DATE_FORMAT,
  DEFAULT_DROPDOWN_VALUES,
  ORDER_DATES_FILTER,
} from '../../../stations/shared/const-var';
import moment from 'moment';
import * as _ from 'lodash';
import {forceUpdate, formatDate, resetPagination} from '../../../../shared/helpers/common';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {ChargeStatus, TRANSACTION_MIX_PAYMENT_METHODS} from '../../shared/const-var';
import {IMerchantRole, ITransaction} from '../../../../shared/interfaces/merchant.interface';
import {TransactionType} from '../../../../shared/enums/merchant.enum';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  moduleId: module.id,
  selector: 'app-charges',
  templateUrl: './charges.html',
  styleUrls: ['./charges.scss'],
})
export class ChargesComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ITransaction>;
  pagination: IPagination<ITransaction>;
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  readonly transactionType = TransactionType.CHARGE;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Payments',
    },
    {
      label: 'Charges',
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

  statusText = _.mapValues(ChargeStatus, (value) => _.startCase(_.lowerCase(value)));
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
  paymentMixMethods: IDropdownItem[];
  paymentMixMethod: IDropdownItem;
  paymentMethod = '';
  paymentSubmethod = '';
  roles: IMerchantRole;

  constructor(private merchantService: ApiMerchantsService) {}

  ngOnInit() {
    this.reset();
    this.initSessionRoles();
    this.paymentMixMethods = Object.keys(TRANSACTION_MIX_PAYMENT_METHODS).map((key) => ({
      text: TRANSACTION_MIX_PAYMENT_METHODS[key].text,
      value: key,
    }));
    this.paymentMixMethod = this.paymentMixMethods[0];
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
        paymentMethod: this.paymentMethod,
        paymentSubmethod: this.paymentSubmethod,
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

  updatePaymentMethod() {
    const value = this.paymentMixMethod.value;
    const {paymentMethod, paymentSubmethod} = TRANSACTION_MIX_PAYMENT_METHODS[value] || {
      paymentMethod: '',
      paymentSubmethod: '',
    };

    this.paymentMethod = paymentMethod;
    this.paymentSubmethod = paymentSubmethod.toLowerCase();
    return this.filter();
  }

  transformToMixPaymentMethod(transaction) {
    const selectedPaymentMethod = Object.values(TRANSACTION_MIX_PAYMENT_METHODS).find(
      (mixPaymentMethod) => {
        if (transaction?.paymentMethod && transaction?.paymentSubmethod) {
          return (
            transaction?.paymentMethod === mixPaymentMethod.paymentMethod &&
            transaction?.paymentSubmethod === mixPaymentMethod.paymentSubmethod
          );
        } else if (transaction?.paymentMethod && !transaction?.paymentSubmethod) {
          return transaction?.paymentMethod === mixPaymentMethod.paymentMethod;
        } else if (!transaction?.paymentMethod && !transaction?.paymentSubmethod) {
          return (
            mixPaymentMethod.paymentMethod === 'wallet' &&
            mixPaymentMethod.paymentSubmethod === 'WALLET_SETEL'
          );
        }
      },
    );
    return selectedPaymentMethod ? selectedPaymentMethod.text : '';
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
