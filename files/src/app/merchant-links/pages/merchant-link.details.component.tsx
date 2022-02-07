import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {BreadcrumbItem} from '../../../react/components/app-breadcrumbs';
import {MerchantLinkDetails} from '../../../react/modules/merchant-links/components/merchant-link-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class MerchantLinkDetailsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Administration',
    },
    {
      label: 'Enterprise specification',
    },
    {
      label: 'Merchant links',
    },
    {
      label: 'Merchant link details',
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
          <MerchantLinkDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
