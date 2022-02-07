import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from '../../../../react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from '../../../../react/modules/adapter';
import {SmartpayAccountAddressDetails} from '../../../../react/modules/merchants/components/smartpay-account/smartpay-details-address-details';
import {SmartpayAccountContactDetails} from '../../../../react/modules/merchants/components/smartpay-account/smartpay-details-contact-details';
import {SmartpayAccountTabs} from '../../../../shared/enums/merchant.enum';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class SmartpayAccountChildren implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [];
  tabLabel = '';
  type = '';

  constructor(private route: ActivatedRoute, private adapter: ReactAdapterService) {}

  ngAfterViewInit() {
    this.render();
    this.route.queryParams.subscribe(() => {
      this.updateBreadcrumbs();
    });

    this.route.url.subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  updateBreadcrumbs() {
    this.tabLabel = this.route.snapshot.paramMap.get('tab');
    this.breadcrumbs = [
      {
        label: 'Businesses',
      },
      {
        label: 'Merchants',
      },
      {
        label: 'Smartpay Account',
      },
      {
        label: `${this.tabLabel}`,
      },
      {
        label: `${this.tabLabel.split(' ')[0]} details`,
      },
    ];
    this.render();
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.route}>
          {this.tabLabel === SmartpayAccountTabs.ADDRESS_LIST && (
            <SmartpayAccountAddressDetails
              type={this.route.snapshot.paramMap.get('type')}
              spId={this.route.snapshot.paramMap.get('id')}
              id={this.route.snapshot.paramMap.get('childrenId')}
            />
          )}
          {this.tabLabel === SmartpayAccountTabs.CONTACT_LIST && (
            <SmartpayAccountContactDetails
              type={this.route.snapshot.paramMap.get('type')}
              spId={this.route.snapshot.paramMap.get('id')}
              id={this.route.snapshot.paramMap.get('childrenId')}
            />
          )}
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
