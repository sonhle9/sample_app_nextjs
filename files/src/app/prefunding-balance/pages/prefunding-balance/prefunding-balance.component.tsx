import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';

import {ActivatedRouteContext} from 'src/react/routing/routing.context';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {PrefundingBalance} from 'src/react/modules/treasury/prefunding-balance/components/prefunding-balance';

@Component({template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>'})
export class PrefundingBalanceComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Treasury',
    },
    {
      label: 'Wallet prepaid balance',
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
          <ActivatedRouteContext.Provider value={this.activatedRoute}>
            <PrefundingBalance />
          </ActivatedRouteContext.Provider>
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
