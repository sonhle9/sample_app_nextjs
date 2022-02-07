import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {titleCase} from '@setel/portal-ui';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {TrusteeReportDetails} from '../../../../react/modules/treasury/reports/components/trustee/trustee-report-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class TrusteeReportDetailsComponent implements AfterViewInit, OnDestroy {
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
      label: 'Trustee',
      to: '/treasury-reports/trustee',
    },
    {
      label: titleCase(this.route.snapshot.paramMap.get('id')),
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
          <TrusteeReportDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
