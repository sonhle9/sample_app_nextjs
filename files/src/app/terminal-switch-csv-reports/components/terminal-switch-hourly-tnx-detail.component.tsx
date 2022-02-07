import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {TerminalSwitchHourlyTransactionFileDetail} from 'src/react/modules/terminal-switch-csv-reports/components/terminal-switch-hourly-transaction-file-detail';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class TerminalSwitchHourlyTnxFileDetailComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [];

  date = '';

  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    this.render();

    this.activatedRoute.queryParams.subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  updateBreadcrumbs() {
    this.date = this.activatedRoute.snapshot.queryParamMap.get('date');
    this.breadcrumbs = [
      {
        label: 'Financial services',
      },
      {
        label: '...',
      },
      {
        label: 'Hourly transaction file',
        to: '/gateway/csv-reports/hourly-transaction-file',
      },
      {
        label: this.date,
      },
    ];
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    const {id} = this.activatedRoute.snapshot.params;

    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <TerminalSwitchHourlyTransactionFileDetail id={id} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
