import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from '../../../react/modules/adapter';
import {BreadcrumbItem} from '../../../react/components/app-breadcrumbs';
import {BillingStatementSummaryDetail} from '../../../react/modules/billing-summary/components/billing-statement-summary-detail';

@Component({template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>'})
export class BillingStatementSummaryDetailsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Billing',
    },
    {
      to: 'billing/statement-summary',
      label: 'Statement summary',
    },
    {
      label: 'Statement summary details',
    },
  ];

  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <BillingStatementSummaryDetail
            billingStatementSummaryId={this.activatedRoute.snapshot.paramMap.get('id')}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
