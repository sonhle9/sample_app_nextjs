import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {TerminalSwitchHourlyTransactionFileTab} from 'src/react/modules/terminal-switch-csv-reports/components/terminal-switch-csv-reports-tab';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class TerminalSwitchCsvReportTabComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [];

  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    this.render();

    this.activatedRoute.url.subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  tabs = ['hourly-transaction-file', 'full-mti-tid-mapping'];

  updateBreadcrumbs() {
    const tab = this.activatedRoute.snapshot.params.tab;
    const activeTabIndex = this.tabs.indexOf(tab) | 0;
    this.breadcrumbs = [
      {
        label: 'Financial services',
      },
      {
        label: '...',
      },
      {
        label: 'CSV reports',
      },
      {
        label:
          activeTabIndex === 1
            ? 'Full MID & TID mapping monthly report'
            : 'Hourly Transaction File',
      },
    ];
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
          <TerminalSwitchHourlyTransactionFileTab />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
