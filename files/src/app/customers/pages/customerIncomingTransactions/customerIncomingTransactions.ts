import {Component, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {AuthService} from '../../../auth.service';
import {ITransaction} from '../../../../shared/interfaces/transaction.interface';
import {ApiCustomersService} from '../../../api-customers.service';
import {ActivatedRoute} from '@angular/router';
import {ApiPaymentsService} from 'src/app/api-payments.service';

@Component({
  selector: 'app-customer-incoming-transactions',
  templateUrl: './customerIncomingTransactions.html',
  styleUrls: ['./customerIncomingTransactions.scss'],
})
export class CustomerIncomingTransactionsComponent implements OnDestroy {
  @Input()
  customerId;

  data: ITransaction[] = [];
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

  messageContent: string;
  messageType: string;

  constructor(
    route: ActivatedRoute,
    private customersService: ApiCustomersService,
    private paymentsService: ApiPaymentsService,
    protected authService: AuthService,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.customerId = param.id;
      this.indexVouchers();
    });
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }

  indexVouchers(loader = 'full') {
    this.loading[loader] = true;
    this.customersService
      .getCustomerIncomingBalanceTransactions(this.customerId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.data = res;
          this.loading.stop();
        },
        (err) => {
          this.data = [];
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  tryUseIncomingBalance() {
    this.loading['page'] = true;
    this.paymentsService
      .tryUseIncomingBalance(this.customerId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (balance) => {
          this.loading.stop();
          this.messageContent = `Try use incoming balance done (${balance}).`;
          this.messageType = '';
        },
        () => {
          this.loading.stop();
          this.messageContent = 'Try use incoming balance failed.';
          this.messageType = 'error';
        },
      );
  }

  getData() {
    return this.data;
  }
}
