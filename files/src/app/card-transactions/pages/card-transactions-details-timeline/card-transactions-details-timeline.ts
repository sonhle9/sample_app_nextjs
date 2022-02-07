import {
  Component,
  OnDestroy,
  Input,
  ViewEncapsulation,
  ViewChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import * as _ from 'lodash';
import {Subject} from 'rxjs';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-card-transactions-details-timeline',
  templateUrl: './card-transactions-details-timeline.html',
  styleUrls: ['./card-transactions-details-timeline.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CardTransactionDetailsTimelineComponent implements OnDestroy {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('card') dataTimelines;
  @ViewChildren('elReference') elReference: QueryList<ElementRef>;

  allSub: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  fnChangeShowName = (str: string) => {
    return _.isString(str)
      ? (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).split('_').join(' ')
      : str;
  };
}
