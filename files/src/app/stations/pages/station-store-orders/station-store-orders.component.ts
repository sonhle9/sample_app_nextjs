import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {OverCounterOrderList} from 'src/react/modules/store-orders/components/over-counter-order-list';

@Component({
  selector: 'app-station-store-orders',
  template: `<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async"></div>`,
})
export class StationStoreOrdersComponent {
  reactComponent = OverCounterOrderList;
  reactProps: Observable<{stationId: string}>;

  constructor(route: ActivatedRoute) {
    this.reactProps = route.parent.paramMap.pipe(
      map((params) => ({
        stationId: params.get('id'),
      })),
    );
  }
}
