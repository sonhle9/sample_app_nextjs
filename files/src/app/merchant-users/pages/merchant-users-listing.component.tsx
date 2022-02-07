import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ReactAdapterProvider, ReactAdapterService} from '../../../react/modules/adapter';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MerchantUserListing} from '../../../react/modules/merchant-users/components/merchant-users-listing';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class MerchantUsersListingComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Administration',
    },
    {
      label: 'Teams',
    },
    {
      label: 'Merchant users',
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
    if (this.wrapper?.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <MerchantUserListing />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
