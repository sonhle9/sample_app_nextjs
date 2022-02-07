import {Component, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-card-transactions-details-itemised',
  templateUrl: './card-transactions-details-itemised.component.html',
  styleUrls: ['./card-transactions-details-itemised.component.scss'],
})
export class CardTransactionsDetailsItemisedComponent implements OnDestroy {
  @Input() itemisedDetails;

  allSub: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }
}
