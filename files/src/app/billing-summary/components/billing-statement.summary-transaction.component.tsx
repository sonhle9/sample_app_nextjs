import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from '../../../react/modules/adapter';
import {BreadcrumbItem} from '../../../react/components/app-breadcrumbs';
import {BillingStatementSummaryTransactions} from '../../../react/modules/billing-summary/components/billing-statement-summary-transaction';
import {TitleStatementTransaction} from '../../../react/modules/billing-summary/billing-statement-summary.constants';

@Component({template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>'})
export class BillingStatementSummaryTransactionsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Billing',
    },
    {
      label: 'Statement summary',
    },
    {
      to: `billing/statement-summary/${this.activatedRoute.snapshot.paramMap.get('id')}`,
      label: 'Statement summary details',
    },
    {
      label: TitleStatementTransaction[this.activatedRoute.snapshot.queryParamMap.get('subType')],
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
          <BillingStatementSummaryTransactions
            billingStatementSummaryId={this.activatedRoute.snapshot.paramMap.get('id')}
            type={this.activatedRoute.snapshot.queryParamMap.get('type')}
            subType={this.activatedRoute.snapshot.queryParamMap.get('subType')}
            isPrevCycle={this.activatedRoute.snapshot.queryParamMap.get('isPrevCycle')}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
