import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {MerchantDetails} from 'src/react/modules/merchants/components/merchants-details';
import {BreadcrumbItem} from '../../../../react/components/app-breadcrumbs';
import {getMerchantTypeNameByCode} from '../../../../react/modules/merchants/merchants.lib';
import {AuthService} from '../../../auth.service';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class MerchantDetailsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [];
  typeName = '';
  typeCode = '';
  tabLabel = '';

  constructor(
    private route: ActivatedRoute,
    private adapter: ReactAdapterService,
    private authService: AuthService,
  ) {}

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
    this.typeName = this.typeCode ? getMerchantTypeNameByCode(this.typeCode) : undefined;
    this.breadcrumbs = [
      {
        label: 'Businesses',
      },
      {
        label: 'Merchants',
      },
      {
        label: this.typeName || 'All merchants',
      },
      {
        label: `${this.typeName || 'Merchant'} details`,
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
          <div className={'px-20 py-10'}>
            <MerchantDetails
              userEmail={this.authService.getSession()?.email}
              typeName={this.typeName}
              id={this.route.snapshot.paramMap.get('id')}
            />
          </div>
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
