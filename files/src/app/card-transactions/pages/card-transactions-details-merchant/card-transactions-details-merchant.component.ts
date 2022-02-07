import {Component, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-card-transactions-details-merchant',
  templateUrl: './card-transactions-details-merchant.component.html',
  styleUrls: ['./card-transactions-details-merchant.component.scss'],
})
export class CardTransactionsDetailsMerchantComponent implements OnDestroy {
  @Input() merchantDetails;

  allSub: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }
}
