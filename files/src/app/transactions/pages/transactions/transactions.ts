import {Component, OnInit, OnDestroy} from '@angular/core';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {
  DEFAULT_DROPDOWN_VALUES,
  ORDER_DATES_FILTER,
  DATE_FORMAT,
  TRANSACTION_MIX_TYPE,
  TransactionStatus,
} from '../../../stations/shared/const-var';
import moment from 'moment';
import {TitleCasePipe} from '@angular/common';
import {formatDate, resetPagination, forceUpdate} from '../../../../shared/helpers/common';
import {ApiTransactionService} from 'src/app/api-transactions.service';
import {ITransaction, ITransactionRole} from 'src/shared/interfaces/transaction.interface';
import {ApiReportsService} from 'src/app/api-reports-service';
import {PaymentMethod, TRANSACTION_MIX_PAYMENT_METHODS} from '../../shared/const-var';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
// import {PaymentMethodPipe} from 'src/shared/pipes/payment-method.pipe';

@Component({
  moduleId: module.id,
  selector: 'app-transactions',
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss'],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<ITransaction>;
  pagination: IPagination<ITransaction>;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Payments',
    },
    {
      label: 'Transactions',
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

  types: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    Object.keys(TRANSACTION_MIX_TYPE).map((key) => ({
      text: TRANSACTION_MIX_TYPE[key].text,
      value: key,
    })),
  );

  selectedMixType = this.types[0];

  selectedType;
  selectedSubType = '';

  statuses: IDropdownItem[] = DEFAULT_DROPDOWN_VALUES.concat(
    Object.keys(TransactionStatus).map((key) => ({
      text: this.titlecasePipe.transform(TransactionStatus[key]),
      value: key,
    })),
  );
  selectedStatus = this.statuses[0];

  dateTypes: IDropdownItem[] = ORDER_DATES_FILTER;
  selectedDate: IDropdownItem = this.dateTypes[0];

  startDate: string;
  endDate: string;

  errorMessage = {
    endDate: '',
  };

  roles: ITransactionRole;

  paymentMixMethods: IDropdownItem[];
  paymentMixMethod: IDropdownItem;
  paymentMethod = '';
  paymentSubmethod = '';
  excludedPaymentMethod = PaymentMethod.MESRA_CARD;

  constructor(
    private transactionService: ApiTransactionService,
    private reportsService: ApiReportsService,
    private titlecasePipe: TitleCasePipe, // private paymentMethodPine: PaymentMethodPipe,
  ) {
    this.reset();
    this.initSessionRoles();
  }

  ngOnInit() {
    // this.paymentMethods = PaymentMethods.map((item) => ({
    //   text: this.paymentMethodPine.transform(item),
    //   value: item,
    // }));
    this.paymentMixMethods = Object.keys(TRANSACTION_MIX_PAYMENT_METHODS)
      .map((key) => ({
        text: TRANSACTION_MIX_PAYMENT_METHODS[key].text,
        value: key,
      }))
      .filter((p) => p.text !== TRANSACTION_MIX_PAYMENT_METHODS.cardMersacard.text);

    this.paymentMixMethod = this.paymentMixMethods[0];
    this.indexTransactions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.transactionService.getRolePermissions();
  }

  indexTransactions(loader = 'full') {
    this.pagination.items = [];
    this.loading[loader] = true;
    this.transactionService
      .indexTransactions(
        this.pagination.index,
        this.pagination.page,
        this.selectedType,
        this.selectedSubType,
        this.selectedStatus.value,
        formatDate(this.startDate),
        formatDate(this.endDate),
        this.paymentMethod,
        this.paymentSubmethod,
        this.excludedPaymentMethod,
      )
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination.hideCount = true;
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

  transformToMixPaymentMethod(transaction) {
    const selectedPaymentMethod = Object.values(TRANSACTION_MIX_PAYMENT_METHODS).find(
      (mixPaymentMethod) => {
        return (
          transaction.paymentMethod === mixPaymentMethod.paymentMethod &&
          (!transaction.paymentSubmethod ||
            transaction.paymentSubmethod === mixPaymentMethod.paymentSubmethod)
        );
      },
    );
    return selectedPaymentMethod ? selectedPaymentMethod.text : '';
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

  updateType() {
    const value = this.selectedMixType.value;
    const {type, subType} = TRANSACTION_MIX_TYPE[value] || {type: '', subType: ''};
    this.selectedType = type;
    this.selectedSubType = subType;

    return this.filter();
  }

  updatePaymentMethod() {
    const value = this.paymentMixMethod.value;
    const {paymentMethod, paymentSubmethod} = TRANSACTION_MIX_PAYMENT_METHODS[value] || {
      paymentMethod: '',
      paymentSubmethod: '',
    };

    this.paymentMethod = paymentMethod;
    this.paymentSubmethod = paymentSubmethod;

    return this.filter();
  }

  downloadCsv = () =>
    this.reportsService.transactions(
      this.selectedType,
      this.selectedSubType,
      formatDate(this.startDate),
      formatDate(this.endDate),
      this.selectedStatus.value,
    );

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
