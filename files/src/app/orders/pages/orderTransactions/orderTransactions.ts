import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {ITransaction} from '../../../../shared/interfaces/transaction.interface';
import {IOrderRole} from './../../../../shared/interfaces/order.interface';
import {ApiOrderService} from './../../../api-orders.service';
import {ApiTransactionService} from '../../../api-transactions.service';
import {resetPagination, forceUpdate} from '../../../../shared/helpers/common';
import {IDropdownItem} from 'src/shared/components/dropdown/dropdown.interface';
import {TransactionType} from 'src/app/stations/shared/const-order-status';
import {MatSelectChange} from '@angular/material/select';
import {MatDialog} from '@angular/material/dialog';
import {OrdersDialogComponent} from '../orders-dialog/orders-dialog.component';

@Component({
  selector: 'app-order-transactions',
  templateUrl: './orderTransactions.html',
  styleUrls: ['./orderTransactions.scss'],
})
export class OrderTransactionsComponent implements OnInit, OnDestroy {
  @Input()
  orderId;

  @Input()
  userId;

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

  selectedChargeType = this.transactionType[0];
  isButtonDisabled: boolean;
  isInputDisabled: boolean;
  hasAddModal: boolean;

  errorMessage: any;
  updateErrorMessage: any;
  messageType: string;
  message: string;
  modalLoading: boolean;
  amount: number;
  roles: IOrderRole;

  allSub: Subject<any> = new Subject<any>();

  constructor(
    private transactionService: ApiTransactionService,
    private orderSerivce: ApiOrderService,
    public dialog: MatDialog,
  ) {
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
    this.roles = this.orderSerivce.getRolePermissions();
  }

  indexTransactions() {
    if (!this.orderId) {
      return;
    }

    this.pagination.items = [];
    this.loading.page = true;
    this.transactionService
      .indexOrderTransactions(
        this.orderId,
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

  onChange(event: MatSelectChange) {
    const value = event.value;

    if (value === 'cancelAuthorize') {
      this.isInputDisabled = true;
      this.amount = null;
    }

    if (value === 'chargeByAmount') {
      this.isInputDisabled = false;
    }

    if (value === 'chargeByInvoice') {
      this.isInputDisabled = true;
      this.amount = null;
    }
  }

  cancelAuthorize() {
    this.modalLoading = true;
    this.orderSerivce
      .cancelAuthorize(this.orderId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.message = 'Authorize amount successfully cancelled';
          this.messageType = 'success';
          this.modalLoading = false;
          this.indexTransactions();
        },
        () => {
          this.message = 'Ops! Unable to cancel authorize';
          this.messageType = 'error';
          this.modalLoading = false;
          this.indexTransactions();
        },
      );
  }

  retryPurchase() {
    this.modalLoading = true;
    this.orderSerivce
      .retryPurchase(this.orderId, this.amount)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.message = 'Manual charge successful.';
          this.messageType = 'success';
          this.modalLoading = false;
          this.indexTransactions();
        },
        () => {
          this.message = 'Ops! Unable to manual charge';
          this.messageType = 'error';
          this.modalLoading = false;
          this.indexTransactions();
        },
      );
  }

  openDialog(action): void {
    const type = action.value;
    const dialogRef = this.dialog.open(OrdersDialogComponent, {
      width: '400px',
      data: {
        type,
        amount: this.amount,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'cancelAuthorize') {
        this.cancelAuthorize();
      }

      if (result === 'chargeByAmount' || result === 'chargeByInvoice') {
        this.retryPurchase();
      }
    });
  }
}
