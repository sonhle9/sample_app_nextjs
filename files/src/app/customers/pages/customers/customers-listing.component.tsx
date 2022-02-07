import {Component, ElementRef, ViewChild} from '@angular/core';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CustomerListing} from 'src/react/modules/customers/customers-listing';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {BridgeComponent} from 'src/shared/interfaces/bridge-component.interface';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CustomerListingComponent implements BridgeComponent {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Users',
    },
    {
      to: '/accounts',
      label: 'Accounts',
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
          <CustomerListing />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
