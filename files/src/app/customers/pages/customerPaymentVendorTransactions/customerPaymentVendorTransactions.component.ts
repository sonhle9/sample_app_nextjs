import {Component, OnChanges, Input, OnDestroy} from '@angular/core';
import {ApiCustomersService} from '../../../api-customers.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ITransaction} from '../../../../shared/interfaces/transaction.interface';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {resetPagination, forceUpdate} from '../../../../shared/helpers/common';
import {ICustomerRole} from 'src/shared/interfaces/customer.interface';

@Component({
  selector: 'app-customer-payment-vendor-transactions',
  templateUrl: './customerPaymentVendorTransactions.component.html',
  styleUrls: ['./customerPaymentVendorTransactions.component.scss'],
})
export class CustomerPaymentVendorTransactionsComponent implements OnChanges, OnDestroy {
  @Input()
  customerId;

  @Input()
  customerName;

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

  roles: ICustomerRole;
  allSub: Subject<any> = new Subject<any>();

  constructor(private apiCustomersService: ApiCustomersService) {
    this.reset();
    this.initSessionRoles();
  }

  ngOnChanges() {
    this.indexTransactions();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  private initSessionRoles() {
    this.roles = this.apiCustomersService.getRolePermissions();
  }

  indexTransactions() {
    if (!this.customerId) {
      return;
    }

    this.pagination.items = [];
    this.loading.page = true;
    this.apiCustomersService
      .indexCustomerPaymentTransactions(this.customerId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination.items = this._pagination.items = res.items;
          this.pagination = forceUpdate(this.pagination);
          this.loading.stop();
        },
        (err) => {
          serviceHttpErrorHandler(err);
          this.reset();
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

  afterAddedTransaction() {
    this.reset();
    this.indexTransactions();
  }
}
