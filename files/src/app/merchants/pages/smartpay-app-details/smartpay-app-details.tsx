import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {BreadcrumbItem} from '../../../../react/components/app-breadcrumbs';
import {getMerchantTypeNameByCode} from '../../../../react/modules/merchants/merchants.lib';
import {MerchantTypeCodes} from '../../../../shared/enums/merchant.enum';
import {SmartpayApplicationDetails} from '../../../../react/modules/merchants/components/smartpay-account/smartpay-application-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class SmartpayAppDetailsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [];
  typeName = '';
  typeCode = '';
  tabLabel = '';

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

  updateBreadcrumbs() {
    this.typeCode = this.route.snapshot.paramMap.get('code');
    this.tabLabel = this.route.snapshot.queryParamMap.get('tab');
    this.typeName = getMerchantTypeNameByCode(MerchantTypeCodes.SMART_PAY_ACCOUNT);
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
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.route}>
          <SmartpayApplicationDetails id={this.route.snapshot.paramMap.get('appId')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
