import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {TerminalSwitchBatchDetail} from 'src/react/modules/terminal-switch-batches/components/terminal-switch-batch.detail';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class TerminalSwitchForceCloseApprovalDetailComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: '...',
    },
    {
      label: 'Force close approval',
      to: '/gateway/force-close-approval',
    },
    {
      label: 'Force close approval details',
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
      const {batchId} = this.activatedRoute.snapshot.params;
      ReactDOM.render(
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <TerminalSwitchBatchDetail isForceClose batchId={batchId} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
