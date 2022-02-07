import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {titleCase} from '@setel/portal-ui';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {TreasuryReportsDownload} from 'src/react/modules/treasury/reports/components/treasury-reports-download';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CardReportsDownloadComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    const url = this.activatedRoute.snapshot.params.url;
    const reportName = url.split('-').join(' ');
    this.breadcrumbs = [
      {
        label: 'Financial services',
      },
      {
        label: 'Card issuing',
      },
      {
        to: '/card-issuing/reports',
        label: 'Report',
      },
      {
        to: `/card-issuing/reports/${url}`,
        label: titleCase(reportName),
      },
      {
        label: 'Download',
      },
    ];
  }

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
          <TreasuryReportsDownload
            generationId={this.activatedRoute.snapshot.queryParamMap.get('generationId')}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
