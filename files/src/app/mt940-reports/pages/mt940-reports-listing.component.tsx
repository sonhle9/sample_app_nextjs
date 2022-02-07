import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {titleCase} from '@setel/portal-ui';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {MT940ReportsListing} from 'src/react/modules/mt940-reports/components/mt940-reports-listing';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class MT940ReportsListingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Treasury',
    },
    {
      label: 'Reports',
      to: '/treasury-reports',
    },
    {
      label: `MT940 - ${titleCase(this.route.snapshot.paramMap.get('account'))}`,
    },
  ];

  constructor(private route: ActivatedRoute, private adapterService: ReactAdapterService) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapterService} activatedRoute={this.route}>
          <MT940ReportsListing
            account={this.route.snapshot.paramMap.get('account') as 'OPERATING' | 'COLLECTION'}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
