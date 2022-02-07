import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-card-details-financial',
  templateUrl: './card-details-financial.component.html',
  styleUrls: ['./card-details-financial.component.scss'],
})
export class CardDetailsFinancialComponent implements OnInit, OnDestroy {
  @Input() cardBalance;
  allSub: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }
}
