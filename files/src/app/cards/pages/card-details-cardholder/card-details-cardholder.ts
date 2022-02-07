import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-card-details-cardholder',
  templateUrl: './card-details-cardholder.html',
  styleUrls: ['./card-details-cardholder.scss'],
})
export class CarddetailsCardholderComponent implements OnInit, OnDestroy {
  @Input() card;

  allSub: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }
}
