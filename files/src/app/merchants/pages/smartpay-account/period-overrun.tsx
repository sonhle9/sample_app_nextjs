import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {BreadcrumbItem} from '../../../../react/components/app-breadcrumbs';
import {PeriodOverrunDetails} from '../../../../react/modules/merchants/components/smartpay-account/credit-overrun/period-overrun-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class PeriodOverrunComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Businesses',
    },
    {
      label: 'Merchants',
    },
    {
      label: 'Smartpay accounts',
    },
    {
      label: 'Credit period overrun',
    },
    {
      label: 'Credit period overrun details',
    },
  ];

  constructor(private route: ActivatedRoute, private adapter: ReactAdapterService) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.route}>
          <PeriodOverrunDetails
            merchantId={this.route.snapshot.paramMap.get('merchantId')}
            periodOverrunId={this.route.snapshot.paramMap.get('periodOverrunId')}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
