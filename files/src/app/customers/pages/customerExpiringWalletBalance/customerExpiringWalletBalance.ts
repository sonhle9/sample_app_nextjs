import {Component, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {AuthService} from '../../../auth.service';
import {ApiBalanceExpiryService} from '../../../api-balance-expiry.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-customer-expiring-wallet-balance',
  templateUrl: './customerExpiringWalletBalance.html',
  styleUrls: ['./customerExpiringWalletBalance.scss'],
})
export class CustomerExpiringWalletBalanceComponent implements OnDestroy {
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
  balance;
  DAYS_TO_EXPIRE = 14;

  allSub: Subject<any> = new Subject<any>();

  constructor(
    route: ActivatedRoute,
    private balanceExpiryService: ApiBalanceExpiryService,
    protected authService: AuthService,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.customerId = param.id;
      this.indexExpiringBalance();
    });
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }

  indexExpiringBalance(loader = 'full') {
    this.loading[loader] = true;
    this.balanceExpiryService
      .indexExpiringBalance(this.customerId, this.DAYS_TO_EXPIRE)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.balance = res.expiryBalance;
          this.loading.stop();
        },
        (err) => {
          this.balance = 0;
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  getExpiringWalletBalance() {
    return this.balance;
  }
}
