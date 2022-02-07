import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {titleCase} from '@setel/portal-ui';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {MT940ReportsDetails} from 'src/react/modules/mt940-reports/components/mt940-reports-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class MT940ReportsDetailsComponent implements AfterViewInit, OnDestroy {
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
      to: `/treasury-reports/mt940/${this.route.snapshot.paramMap.get('account')}`,
    },
    {
      label: titleCase(this.route.snapshot.paramMap.get('id')),
    },
  ];

  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

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
          <MT940ReportsDetails
            id={this.route.snapshot.paramMap.get('id')}
            account={this.route.snapshot.paramMap.get('account') as 'OPERATING' | 'COLLECTION'}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
