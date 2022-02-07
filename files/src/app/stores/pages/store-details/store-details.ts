import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {IStoreDetailsProps, StoreDetails} from 'src/react/modules/stores/components/store-details';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-store-details',
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async" [appBreadcrumbs]="breadcrumbs"></div>',
  styleUrls: [],
})
export class StoreDetailsComponent {
  reactComponent = StoreDetails;
  reactProps: Observable<IStoreDetailsProps>;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      to: '/stores',
      label: 'Stores',
    },
    {
      label: 'Store Details',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) {
    this.reactProps = this.activatedRoute.paramMap.pipe(
      map((params) => ({
        storeId: params.get('storeId'),
        tab: params.get('tab') as 'details' | 'items',
      })),
    );
  }
}
