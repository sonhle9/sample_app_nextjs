import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {TerminalSwitchTransactionDetail} from 'src/react/modules/terminal-switch-transactions/components/terminal-switch-transaction-detail';
import {BreadcrumbsService} from 'src/shared/components/breadcrumbs/breadcrumbs.service';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class TerminalSwitchTransactionDetailComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: '...',
    },
    {
      label: 'Transactions',
      to: '/gateway/transactions',
    },
  ];
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
    private readonly breadcrumbService: BreadcrumbsService,
  ) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    const {transactionId} = this.activatedRoute.snapshot.params;
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <TerminalSwitchTransactionDetail
            transactionId={transactionId}
            onCompletedDisplayedPanCalc={(displayedPan) => {
              if (!displayedPan) return;
              this.breadcrumbService.setBreadcrumbs([
                ...this.breadcrumbs,
                {
                  label: displayedPan,
                },
              ]);
            }}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
