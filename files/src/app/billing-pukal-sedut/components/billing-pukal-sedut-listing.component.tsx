import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {BillingPukalSedutListing} from 'src/react/modules/pukal-sedut/components/billing-pukal-sedut-listing';

@Component({template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>'})
export class BillingPukalSedutListingComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Billing',
    },
    {
      label: 'Pukal Sedut',
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
          <BillingPukalSedutListing />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
