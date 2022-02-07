import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IDropdownItem} from 'src/shared/components/dropdown/dropdown.interface';
import {TransactionType} from 'src/app/stations/shared/const-order-status';
import {IPagination} from 'src/shared/interfaces/core.interface';
import {resetPagination, forceUpdate} from '../../../shared/helpers/common';
import {serviceHttpErrorHandler} from 'src/shared/helpers/errorHandling';
import {ApiTransactionService} from 'src/app/api-transactions.service';
import {ITransaction, ITransactionRole} from 'src/shared/interfaces/transaction.interface';

@Component({
  selector: 'app-payment-processor-transactions',
  templateUrl: './paymentProcessorTransaction.html',
  styleUrls: ['./paymentProcessorTransaction.scss'],
})
export class PaymentProcessorTransactionComponent implements OnInit, OnDestroy {
  @Input()
  userId;

  @Input()
  sessionId;

  @Input()
  targetService: string;

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

  transactionType: IDropdownItem[] = Object.keys(TransactionType).map((key) => ({
    text: TransactionType[key],
    value: key,
  }));

  errorMessage: any;
  updateErrorMessage: any;
  modalLoading: boolean;
  amount: number;
  roles: ITransactionRole;

  allSub: Subject<any> = new Subject<any>();

  constructor(private transactionService: ApiTransactionService) {
    this.initSessionRoles();
    this.reset();
  }

  ngOnInit() {
    this.indexTransactions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  private initSessionRoles() {
    this.roles = this.transactionService.getRolePermissions();
  }

  indexTransactions() {
    this.pagination.items = [];
    this.loading.page = true;
    this.transactionService
      .indexPaymentProcessorTransactions(
        this.sessionId,
        this.pagination.index,
        this.pagination.page,
        this.userId,
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

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexTransactions();
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexTransactions();
  }

  reset() {
    this.pagination = this._pagination = resetPagination(10);
  }
}
