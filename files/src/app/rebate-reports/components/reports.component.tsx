import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {RebateReportIcon} from '../../../react/modules/reports/rebate-report-icon';
import {RebateReportsListing} from '../../../react/modules/reports/rebate-reports/components';
import {ReportsListing} from '../../../react/modules/reports/reports-listing';

@Component({template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>'})
export class ReportsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Pricing',
    },
    {
      label: 'Reports',
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
          <ReportsListing
            items={[
              {
                label: 'Rebate reports',
                to: '/pricing/reports/rebate-reports',
                routePath: '/pricing/reports/rebate-reports',
                component: () => <RebateReportsListing />,
                icon: <RebateReportIcon />,
                description: `This report shows the breakdown of rebates provided to accounts based on cycle dates`,
                className: 'w-full md:w-1/2 max-w-xs text-center',
              },
            ]?.map((reportInfo) => {
              const {component, routePath, ...reportItem} = reportInfo;
              return reportItem;
            })}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
