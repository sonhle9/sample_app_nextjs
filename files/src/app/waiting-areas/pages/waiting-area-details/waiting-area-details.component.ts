import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {WaitingAreaDetails} from 'src/react/modules/waiting-areas/components/waiting-area-details';

@Component({
  selector: 'app-waiting-area-details',
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async" [appBreadcrumbs]="breadcrumbs"></div>',
  styleUrls: [],
})
export class WaitingAreaDetailsComponent {
  reactComponent = WaitingAreaDetails;
  reactProps: Observable<React.ComponentProps<typeof WaitingAreaDetails>>;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      to: '/waiting-areas',
      label: 'Waiting areas',
    },
    {
      label: 'Waiting area details',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) {
    this.reactProps = this.activatedRoute.paramMap.pipe(
      map((params) => ({
        id: params.get('id'),
      })),
    );
  }
}
