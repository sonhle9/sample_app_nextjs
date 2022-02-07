import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {FeeSettingsDetails} from 'src/react/modules/ledger/fee-settings/components/fee-settings-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class FeeSettingsDetailComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Treasury',
    },
    {
      label: 'Payment processor fee',
      to: '/fee-settings',
    },
    {
      label: this.route.snapshot.paramMap.get('id'),
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
          <FeeSettingsDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
