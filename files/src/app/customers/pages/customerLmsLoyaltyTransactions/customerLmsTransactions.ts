import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {resetPagination, forceUpdate} from '../../../../shared/helpers/common';
import {ApiLoyaltyService} from 'src/app/api-loyalty.service';
import {ILMSTransaction} from 'src/shared/interfaces/loyalty.interface';
import {ICustomerRole} from 'src/shared/interfaces/customer.interface';
import {ApiCustomersService} from 'src/app/api-customers.service';

@Component({
  selector: 'app-lms-transactions',
  templateUrl: './customerLmsTransactions.html',
  styleUrls: ['./customerLmsTransactions.scss'],
})
export class CustomerLmsTransactionsComponent implements OnInit, OnDestroy {
  @Input()
  customerId: string;

  get errorMessage(): string {
    const postfix = ' does not have any loyalty vendor transactions';

    if (this.customerId) {
      return `Customer ${postfix}`;
    }

    return `There ${postfix}`;
  }

  @Output()
  cardNumber$: EventEmitter<string> = new EventEmitter<string>();

  private _pagination: IPagination<ILMSTransaction>;
  pagination: IPagination<ILMSTransaction>;

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

  constructor(
    private loyaltyService: ApiLoyaltyService,
    private apiCustomersService: ApiCustomersService,
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
    this.roles = this.apiCustomersService.getRolePermissions();
  }

  indexTransactions() {
    this.indexUserTransactions();
  }

  indexUserTransactions() {
    const type = '1';
    if (!this.customerId) {
      return;
    }

    this.loading.page = true;
    this.loyaltyService
      .indexLmsLoyaltyTransactions(
        this.customerId,
        this.pagination.index,
        this.pagination.page,
        type,
      )
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          if (res.items?.[0]?.merchName) {
            this.pagination.max = 0;
            this.pagination.items = this._pagination.items = res.items;
            this.pagination = forceUpdate(this.pagination);
            this.pagination.hideCount = true;
            this.loading.stop();
          } else {
            this.pagination.items = [];
            this.loading.stop();
          }
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
