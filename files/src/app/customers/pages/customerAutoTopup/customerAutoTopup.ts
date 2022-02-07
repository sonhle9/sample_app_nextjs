import {Component, Input, OnDestroy, OnChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IAutoTopup} from 'src/shared/interfaces/creditCards.interface';
import {ApiPaymentsService} from 'src/app/api-payments.service';

@Component({
  moduleId: module.id,
  selector: 'app-customer-auto-top',
  templateUrl: 'customerAutoTopup.html',
  styleUrls: ['customerAutoTopup.scss'],
})
export class CustomerAutoTopupComponent implements OnChanges, OnDestroy {
  @Input()
  customerId;

  autoTopup: IAutoTopup;
  loading: boolean;

  allSub: Subject<any> = new Subject<any>();

  constructor(private apiPaymentService: ApiPaymentsService) {}

  ngOnChanges() {
    this.readAutoTopup();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  readAutoTopup() {
    if (!this.customerId) {
      return;
    }

    this.loading = true;
    this.apiPaymentService
      .readAutoTopup(this.customerId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (card) => {
          this.autoTopup = card;
          this.loading = false;
        },
        () => {
          this.autoTopup = null;
          this.loading = false;
        },
      );
  }
}
