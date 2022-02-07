import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {BreadcrumbItem} from '../../../react/components/app-breadcrumbs';
import {FuelPriceListing} from '../../../react/modules/fuel/components/fuel-price-listing';
import {BridgeComponent} from '../../../shared/interfaces/bridge-component.interface';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class FuelPriceComponent implements BridgeComponent {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Fuelling',
    },
    {
      label: 'Fuel Prices',
    },
  ];

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
          <FuelPriceListing />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
