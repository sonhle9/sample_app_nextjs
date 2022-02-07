import {Component, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-card-transactions-details-card',
  templateUrl: './card-transactions-details-card.component.html',
  styleUrls: ['./card-transactions-details-card.component.scss'],
})
export class CardTransactionsDetailsCardComponent implements OnDestroy {
  @Input() cardDetails;

  allSub: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }
}
