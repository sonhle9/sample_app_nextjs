import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {BadgeDetails} from 'src/react/modules/badge-campaigns/components/badge-details';

@Component({
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class BadgeDetailsComponent {
  reactComponent = BadgeDetails;
  reactProps: Observable<React.ComponentProps<typeof BadgeDetails>>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Gamification',
    },
    {
      to: '/gamification/badge-campaigns',
      label: 'Badge campaigns',
    },
    {
      to: '/gamification/badge-details',
      label: 'Badge details',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) {
    this.reactProps = this.activatedRoute.paramMap.pipe(map((params) => ({id: params.get('id')})));
  }
}
