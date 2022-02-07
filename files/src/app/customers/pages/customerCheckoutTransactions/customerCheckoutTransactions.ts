import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {
  DEFAULT_DROPDOWN_VALUES,
  CHECKOUT_TRANSACTION_DATES_FILTER,
  DATE_FORMAT,
  CHECKOUT_TRANSACTIONS_MIX_STATUS,
} from '../../../stations/shared/const-var';
import moment from 'moment';
import {formatDate, resetPagination, forceUpdate} from '../../../../shared/helpers/common';
import {ApiCheckoutTransactionService} from 'src/app/api-checkout-transactions.service';
import {
  IPaymentMethodLite,
  ITransaction,
  ITransactionRole,
} from 'src/shared/interfaces/checkoutTransaction.interface';
import {CHECKOUT_TRANSACTION_PAYMENT_METHODS} from '../../shared/const-var';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';

@Component({
  moduleId: module.id,
  selector: 'app-customer-checkout-transactions',
  templateUrl: 'customerCheckoutTransactions.html',
  styleUrls: ['customerCheckoutTransactions.scss'],
})
export class CustomerCheckoutTransactionsComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ITransaction>;
  pagination: IPagination<ITransaction>;
  readonly webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;

  @Input()
  customerId;

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

  statuses: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    Object.keys(CHECKOUT_TRANSACTIONS_MIX_STATUS).map((key) => ({
      text: CHECKOUT_TRANSACTIONS_MIX_STATUS[key].text,
      value: key,
    })),
  );
  selectedPaymentStatus = this.statuses[0];

  dateTypes: IDropdownItem[] = CHECKOUT_TRANSACTION_DATES_FILTER;
  selectedDate: IDropdownItem = this.dateTypes[0];

  startDate: string;
  endDate: string;

  errorMessage = {
    endDate: '',
  };

  roles: ITransactionRole;

  paymentMixMethods: IPaymentMethodLite[];
  paymentMixMethod: IPaymentMethodLite;
  paymentMethod: IPaymentMethodLite;

  searchValue = '';
  keyWord = '';

  constructor(private checkoutTransactionService: ApiCheckoutTransactionService) {
    this.reset();
    this.initSessionRoles();
  }

  ngOnInit() {
    this.paymentMixMethods = Object.keys(CHECKOUT_TRANSACTION_PAYMENT_METHODS).map((key) => ({
      text: CHECKOUT_TRANSACTION_PAYMENT_METHODS[key].text,
      family: CHECKOUT_TRANSACTION_PAYMENT_METHODS[key].paymentMethodFamily,
      type: CHECKOUT_TRANSACTION_PAYMENT_METHODS[key].paymentMethodType,
      brand: CHECKOUT_TRANSACTION_PAYMENT_METHODS[key].paymentMethodBrand,
    }));
    this.paymentMixMethod = this.paymentMixMethods[0];
    this.indexTransactions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.checkoutTransactionService.getRolePermissions();
  }

  indexTransactions(name: string = '', loader: string = 'full') {
    if (!this.customerId) {
      return;
    }

    const trimmedValue = name.trim();
    this.keyWord = trimmedValue;

    this.pagination.items = [];
    this.loading[loader] = true;
    this.checkoutTransactionService
      .indexTransactions(
        this.customerId,
        this.pagination.index,
        this.pagination.page,
        this.selectedPaymentStatus.value,
        this.keyWord,
        formatDate(this.startDate),
        formatDate(this.endDate),
        this.paymentMethod?.family,
        this.paymentMethod?.type,
        this.paymentMethod?.brand,
      )
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
    this.pagination = this._pagination = resetPagination(10);
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

  updatePaymentMethod() {
    this.paymentMethod = this.paymentMixMethod;
    return this.filter();
  }

  search() {
    this.reset();
    this.indexTransactions(this.searchValue, 'page');
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexTransactions(this.searchValue, 'page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexTransactions(this.searchValue, 'page');
  }
}
