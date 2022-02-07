import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';

import {ActivatedRouteContext} from 'src/react/routing/routing.context';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {Cashflows} from 'src/react/modules/treasury/cashflows/components/cashflows';

@Component({template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>'})
export class CashflowsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Treasury',
    },
    {
      label: 'Cashflows',
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
            <Cashflows />
          </ActivatedRouteContext.Provider>
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
