import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {AccountDeviceList} from 'src/react/modules/account-devices/components/account-device-list';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class AccountDevicesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Risk controls',
    },
    {
      label: 'Account devices',
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
          <AccountDeviceList />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
