import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ApiCheckoutTransactionService} from 'src/app/api-checkout-transactions.service';
import {ITransaction} from 'src/shared/interfaces/checkoutTransaction.interface';
import {ICustomerLite} from 'src/shared/interfaces/customer.interface';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {AppEmitter} from 'src/app/emitter.service';
import {serviceHttpErrorHandler} from 'src/shared/helpers/errorHandling';
import {ApiCustomersService} from 'src/app/api-customers.service';
import {ApiPaymentsService} from 'src/app/api-payments.service';

@Component({
  moduleId: module.id,
  selector: 'app-sessions',
  templateUrl: './sessions.html',
  styleUrls: ['./sessions.scss'],
})
export class SessionsComponent implements OnInit, OnDestroy {
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

  sessionId: string;

  transaction: ITransaction;

  customer: ICustomerLite;

  targetService: string;

  messageType: string;
  message: string;

  constructor(
    route: ActivatedRoute,
    private apiCheckoutTransactionService: ApiCheckoutTransactionService,
    private customerService: ApiCustomersService,
    private paymentsService: ApiPaymentsService,
    private router: Router,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.sessionId = param.id;
      this.initTransaction(param.id);
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initTransaction(id, loader = 'full') {
    this.loading[loader] = true;
    this.apiCheckoutTransactionService
      .readTransaction(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.transaction = res;
          this.readCustomer(res?.paymentMethodDetails?.userId);

          this.paymentsService
            .getWalletEnv()
            .pipe(takeUntil(this.allSub))
            .subscribe((target: string) => {
              this.targetService = target;
            });

          this.loading.stop();
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }

          serviceHttpErrorHandler(err);
          this.loading.stop();
          this.transaction = null;
          this.router.navigate(['checkouts']);
        },
      );
  }

  readCustomer(cId) {
    this.customer = {
      email: '...',
      phone: '...',
      id: '',
      name: '...',
    };

    this.customerService
      .customer(cId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.customer = res;
        },
        () => {
          this.customer = {
            email: '-',
            phone: '-',
            id: cId,
            name: '',
          };
        },
      );
  }

  syncPaymentStatus() {
    this.apiCheckoutTransactionService
      .syncPaymentStatus(this.sessionId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.message = 'Sync payment status successfully';
          this.messageType = 'success';
          this.initTransaction(this.sessionId);
        },
        () => {
          this.message = 'Ops! Unable to sync payment status';
          this.messageType = 'error';
          this.initTransaction(this.sessionId);
        },
      );
  }
}
