import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {CustomerDashboard} from 'src/react/modules/customers/customer-dashboard';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
@Component({
  selector: 'app-customer-dashboard',
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CustomerDashboardComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Users',
    },
    {
      to: '/accounts',
      label: 'Accounts',
    },
    {
      label: 'Dashboard',
    },
  ];
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

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
          <CustomerDashboard customerID={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
