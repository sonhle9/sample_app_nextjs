import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BreadcrumbItem} from '../../../../react/components/app-breadcrumbs';
import {StationDetails} from '../../../../react/modules/stations/components/station-details';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-station-details',
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class StationDetailsBetaComponent {
  reactComponent = StationDetails;
  reactProps: Observable<{stationId: string}>;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'On-the-go-retail',
    },
    {
      label: 'Retail',
    },
    {
      label: 'Stations',
    },
  ];

  constructor(route: ActivatedRoute) {
    this.reactProps = route.parent.paramMap.pipe(
      map((params) => ({
        stationId: params.get('id'),
      })),
    );
  }
}
