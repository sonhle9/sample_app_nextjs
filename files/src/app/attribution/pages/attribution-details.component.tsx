import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {
  AttributionDetails,
  IAttributionDetailsProps,
} from 'src/react/modules/attribution/components/attribution-details';

@Component({
  selector: 'app-attribution',
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="reactProps" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class AttributionDetailsComponent {
  reactComponent = AttributionDetails;
  reactProps: IAttributionDetailsProps;
  breadcrumbs: BreadcrumbItem[] = [
    {
      to: '/attribution',
      label: 'Attribution',
    },
    {
      to: '/attribution/attribution-rules',
      label: 'Attribution rules',
    },
    {
      label: 'Attribution details',
    },
  ];

  constructor(private route: ActivatedRoute) {
    this.route.paramMap
      .pipe(map((params) => ({id: params.get('id')})))
      .subscribe((props: IAttributionDetailsProps) => {
        this.reactProps = props;
      });
  }
}
