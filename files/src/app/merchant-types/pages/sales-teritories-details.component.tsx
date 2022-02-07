import {AfterViewInit, OnDestroy, ElementRef, ViewChild, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import React from 'react';
import ReactDOM from 'react-dom';
import {BreadcrumbItem} from '../../../react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from '../../../react/modules/adapter';
import {SalesTerritoryDetails} from '../../../react/modules/sales-territories/components/sales-territories-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class SalesTerritoriesDetailComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Administration',
    },
    {
      label: 'Enterprise specification',
    },
    {
      label: 'Merchant types',
    },
    {
      label: 'Sales territory details',
    },
  ];

  constructor(private route: ActivatedRoute, private adapter: ReactAdapterService) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.route}>
          <SalesTerritoryDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
