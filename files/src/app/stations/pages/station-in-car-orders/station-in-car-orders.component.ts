import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Deliver2MeOrderList} from 'src/react/modules/store-orders/components/deliver2me-order-list';

@Component({
  selector: 'app-station-in-car-orders',
  template: `<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async"></div>`,
})
export class StationInCarOrdersComponent {
  reactComponent = Deliver2MeOrderList;
  reactProps: Observable<{stationId: string}>;

  constructor(route: ActivatedRoute) {
    this.reactProps = route.parent.paramMap.pipe(
      map((params) => ({
        stationId: params.get('id'),
      })),
    );
  }
}
