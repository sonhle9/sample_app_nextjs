import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {
  BadgeCampaigns,
  BadgeCampaignsProps,
  BadgeCampaignsTabType,
} from 'src/react/modules/badge-campaigns/components/badge-campaigns';

@Component({
  selector: 'app-badge-campaigns',
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class BadgeCampaignsComponent {
  reactComponent = BadgeCampaigns;
  reactProps: Observable<BadgeCampaignsProps>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Gamification',
    },
    {
      to: '/gamification/badge-campaigns',
      label: 'Badge campaigns',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) {
    this.reactProps = this.activatedRoute.paramMap.pipe(
      map((params) => ({tab: params.get('tab') as BadgeCampaignsTabType})),
    );
  }
}
