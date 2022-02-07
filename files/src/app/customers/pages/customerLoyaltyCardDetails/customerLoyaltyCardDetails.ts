import {Component, OnDestroy} from '@angular/core';
import {Subject, Observable, of} from 'rxjs';
import {
  ILoyaltyCard,
  IVendorLoyaltyCard,
} from '../../../../shared/interfaces/loyaltyCard.interface';
import {ApiCustomersService} from '../../../api-customers.service';
import {ICustomerLite} from '../../../../shared/interfaces/customer.interface';
import {takeUntil} from 'rxjs/operators';
import {ApiLoyaltyService} from 'src/app/api-loyalty.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-customer-loyalty-card-details',
  templateUrl: 'customerLoyaltyCardDetails.html',
  styleUrls: ['customerLoyaltyCardDetails.scss'],
})
export class CustomerLoyaltyCardDetailsComponent implements OnDestroy {
  card$: Observable<ILoyaltyCard> = of(null);
  vendorCard$: Observable<IVendorLoyaltyCard> = of(null);
  myCard: {[k: string]: any} = {};
  customer: ICustomerLite;

  allSub: Subject<any> = new Subject<any>();

  constructor(
    route: ActivatedRoute,
    private apiLoyaltyService: ApiLoyaltyService,
    private customerService: ApiCustomersService,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.initLoyaltyCard(param.id);
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initLoyaltyCard(id: string) {
    this.card$ = this.apiLoyaltyService.readLoyaltyCard(id);

    this.card$.pipe(takeUntil(this.allSub)).subscribe((card) => {
      this.vendorCard$ = this.apiLoyaltyService.readVendorLoyaltyCard(card.cardNumber);
      this.readCustomer(card.userId);
      this.myCard = card;
    });
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
