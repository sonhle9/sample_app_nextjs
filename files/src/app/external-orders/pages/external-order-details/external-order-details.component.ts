import {Component, OnInit, OnDestroy} from '@angular/core';
import {IExternalOrder} from 'src/shared/interfaces/externalOrder.interface';
import {ICustomerLite} from 'src/shared/interfaces/customer.interface';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiExternalOrderService} from 'src/app/api-external-orders.service';
import {takeUntil} from 'rxjs/operators';
import {ApiCustomersService} from 'src/app/api-customers.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {AppEmitter} from 'src/app/emitter.service';
import {serviceHttpErrorHandler} from 'src/shared/helpers/errorHandling';

@Component({
  selector: 'app-external-order-details',
  templateUrl: './external-order-details.component.html',
  styleUrls: ['./external-order-details.component.scss'],
})
export class ExternalOrderDetailsComponent implements OnInit, OnDestroy {
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

  order: IExternalOrder;
  customer: ICustomerLite;

  allSub: Subject<any> = new Subject<any>();

  startDate: string;
  endDate: string;

  constructor(
    route: ActivatedRoute,
    private externalOrderService: ApiExternalOrderService,
    private customerService: ApiCustomersService,
    private router: Router,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.readExternalOrder(param.id);
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  readExternalOrder(id, loader = 'full') {
    this.loading[loader] = true;
    this.externalOrderService
      .getOrder(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          res.totalAmount = res.items.reduce((acc, item) => {
            if (!item || !item.totalPrice) {
              return acc + 0;
            }

            return acc + item.totalPrice;
          }, 0);
          this.order = res;
          this.readCustomer(res.userId);
          this.loading.stop();
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }

          serviceHttpErrorHandler(err);
          this.loading.stop();
          this.order = null;
          this.router.navigate(['orders']);
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
}
