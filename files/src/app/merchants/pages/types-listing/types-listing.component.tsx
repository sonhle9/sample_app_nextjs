import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {MerchantListing} from 'src/react/modules/merchants/components/merchants-listing';
import {getMerchantTypeNameByCode} from '../../../../react/modules/merchants/merchants.lib';
import {AuthService} from '../../../auth.service';
import {MerchantTypeCodes} from '../../../../shared/enums/merchant.enum';
import {SmartpayAccountTabs} from '../../../../react/modules/merchants/components/smartpay-account/smartpay-account-tabs';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class TypesListingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [];
  typeCode = '';
  typeName = '';
  tabLabel = '';

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngAfterViewInit() {
    this.render();
    this.activatedRoute.queryParams.subscribe(() => {
      this.updateBreadcrumbs();
    });

    this.activatedRoute.url.subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  updateBreadcrumbs() {
    this.typeCode = this.activatedRoute.snapshot.paramMap.get('code');
    this.tabLabel = this.activatedRoute.snapshot.queryParamMap.get('tab');
    this.typeName = getMerchantTypeNameByCode(this.typeCode);
    this.breadcrumbs = [
      {
        label: 'Businesses',
      },
      {
        label: 'Merchants',
      },
      {
        label: this.typeName,
      },
      {
        label: this.tabLabel,
      },
    ];
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
          {this.typeCode === MerchantTypeCodes.SMART_PAY_ACCOUNT ? (
            <SmartpayAccountTabs
              userId={this.authService.getSessionData().sub}
              userEmail={this.authService.getSession()?.email}
            />
          ) : (
            <div className={'p-5 mt-2'}>
              <MerchantListing
                typeCode={this.typeCode}
                typeName={this.typeName}
                userEmail={this.authService.getSession()?.email}
              />
            </div>
          )}
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
