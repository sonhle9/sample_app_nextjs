import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {ReceivablesDetails} from 'src/react/modules/treasury/reports/components/receivablesReport/receivables-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class ReceivablesDetailsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Reports',
    },
    {
      label: 'Receivable details',
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
          <ReceivablesDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
