import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {MerchantListing} from 'src/react/modules/merchants/components/merchants-listing';
import {AuthService} from '../../../auth.service';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class MerchantListingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Businesses',
    },
    {
      label: 'Merchants',
    },
    {
      label: 'All merchants',
    },
  ];

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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
          <div className={'p-5 mt-2'}>
            <MerchantListing userEmail={this.authService.getSession()?.email} />
          </div>
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
