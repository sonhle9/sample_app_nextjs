import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {PaymentsMerchantAdjustmentDetails} from 'src/react/modules/payments-adjustments';
import {BridgeComponent} from 'src/shared/interfaces/bridge-component.interface';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class PaymentsMerchantAdjustmentDetailsComponent implements BridgeComponent {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Payments',
    },
    {
      label: 'Adjustments',
      to: '/payments/adjustments/listing/merchant',
    },
    {
      label: 'Adjustment Details',
    },
  ];

  constructor(private adapter: ReactAdapterService, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.activatedRoute}>
          <PaymentsMerchantAdjustmentDetails id={this.activatedRoute.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
