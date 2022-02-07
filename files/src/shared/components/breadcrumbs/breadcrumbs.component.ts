import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppBreadcrumbs, IAppBreadcrumbsProps} from 'src/react/components/app-breadcrumbs';
import {BreadcrumbsService} from './breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  template: ` <div [appReactComponent]="reactComponent" [reactProps]="reactProps | async"></div> `,
})
export class BreadcrumbsComponent {
  reactComponent = AppBreadcrumbs;
  reactProps: Observable<IAppBreadcrumbsProps>;

  constructor(private readonly breadcrumbService: BreadcrumbsService) {
    this.reactProps = this.breadcrumbService.getBreadcrumbs().pipe(map((items) => ({items})));
  }
}
