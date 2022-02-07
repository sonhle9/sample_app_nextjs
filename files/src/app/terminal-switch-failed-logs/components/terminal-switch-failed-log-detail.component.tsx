import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {TerminalSwitchFailedLogDetail} from 'src/react/modules/termial-switch-failed-logs/components/terminal-switch-failed-logs-detail';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class TerminalSwitchFailedLogsDetailComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: '...',
    },
    {
      label: 'Failed Logs',
      to: '/gateway/failed-logs',
    },
    {
      label: 'Failed Log Detail',
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
      const {failedLogId} = this.activatedRoute.snapshot.params;
      ReactDOM.render(
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <TerminalSwitchFailedLogDetail failedLogId={failedLogId} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
