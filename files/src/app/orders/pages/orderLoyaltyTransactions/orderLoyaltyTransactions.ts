import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {resetPagination, forceUpdate} from '../../../../shared/helpers/common';
import {ApiLoyaltyService} from 'src/app/api-loyalty.service';
import {ILoyaltyTransaction} from 'src/shared/interfaces/loyalty.interface';
import {ApiOrderService} from './../../../api-orders.service';
import {IOrderRole} from './../../../../shared/interfaces/order.interface';
import {IDropdownItem} from 'src/shared/components/dropdown/dropdown.interface';
import {LoyaltyType} from 'src/app/stations/shared/const-order-status';
import {MatDialog} from '@angular/material/dialog';
import {OrdersDialogComponent} from '../orders-dialog/orders-dialog.component';
import {MatSelectChange} from '@angular/material/select';
import {LoyaltyReferenceTypesEnum} from 'src/shared/enums/loyalty.enum';

@Component({
  selector: 'app-order-loyalty-transactions',
  templateUrl: './orderLoyaltyTransactions.html',
  styleUrls: ['./orderLoyaltyTransactions.scss'],
})
export class OrderLoyaltyTransactionsComponent implements OnInit, OnDestroy {
  @Input()
  orderId: string;

  @Input()
  customerId: string;

  get errorMessage(): string {
    const postfix = ' does not have any loyalty transactions';
    if (this.orderId) {
      return `Order ${postfix}`;
    }

    if (this.customerId) {
      return `Customer ${postfix}`;
    }

    return `There ${postfix}`;
  }

  @Output()
  cardNumber$: EventEmitter<string> = new EventEmitter<string>();

  private _pagination: IPagination<ILoyaltyTransaction>;
  pagination: IPagination<ILoyaltyTransaction>;
  points: number;
  updateErrorMessage: any;
  messageType: string;
  message: string;
  isInputDisabled: boolean;
  modalLoading: boolean;

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

  loyaltyType: IDropdownItem[] = Object.keys(LoyaltyType).map((key) => ({
    text: LoyaltyType[key],
    value: key,
  }));

  roles: IOrderRole;
  allSub: Subject<any> = new Subject<any>();

  constructor(
    private loyaltyService: ApiLoyaltyService,
    private orderSerivce: ApiOrderService,
    public dialog: MatDialog,
  ) {
    this.reset();
    this.initSessionRoles();
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
    this.indexOrderTransactions();
    this.indexUserTransactions();
  }

  indexOrderTransactions() {
    if (!this.orderId) {
      return;
    }

    this.pagination.items = [];
    this.loading.page = true;
    this.loyaltyService
      .indexOrderLoyaltyTransactions(
        this.orderId,
        LoyaltyReferenceTypesEnum.order,
        this.pagination.index,
        this.pagination.page,
      )
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.publishCardNumber(res.items);
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

  retryGrantPetronasPoints() {
    if (!this.orderId) {
      return;
    }

    this.pagination.items = [];
    this.loading.page = true;
    this.loyaltyService
      .retryGrantPetronasPoints(this.orderId, this.points)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.loading.stop();
          this.message = 'Manual issue points successful.';
          this.messageType = 'success';
          this.indexTransactions();
        },
        (err) => {
          serviceHttpErrorHandler(err);
          this.message = 'Ops! Unable to issue points';
          this.messageType = 'error';
          this.loading.stop();
          this.indexTransactions();
        },
      );
  }

  indexUserTransactions() {
    if (!this.customerId) {
      return;
    }

    this.loading.page = true;
    this.loyaltyService
      .indexUserLoyaltyTransactions(this.customerId, this.pagination.index, this.pagination.page)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.publishCardNumber(res.items);
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

  publishCardNumber(transactions: ILoyaltyTransaction[]) {
    transactions = transactions || [];
    if (transactions.length === 0) {
      return;
    }

    const transaction = transactions[0];
    this.cardNumber$.emit(transaction.receiverCardNumber);
  }

  errorFilter(errMsg, vendorMsg) {
    if (vendorMsg && !vendorMsg.includes('404 - File or directory not found')) {
      const errObj = JSON.parse(vendorMsg);
      return errObj.message || errObj.Message;
    }
    return errMsg;
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

    if (value === 'issuePointByInvoice') {
      this.isInputDisabled = true;
      this.points = null;
    }

    if (value === 'issuePointByAmount') {
      this.isInputDisabled = false;
    }
  }

  openDialog(action): void {
    const type = action.value;
    const dialogRef = this.dialog.open(OrdersDialogComponent, {
      width: '400px',
      data: {
        type,
        points: this.points,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'issuePointByInvoice') {
        this.retryGrantPetronasPoints();
      }
      if (result === 'issuePointByAmount') {
        this.retryGrantPetronasPoints();
      }
    });
  }
}
