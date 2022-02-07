import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {CardRangeListing} from 'src/react/modules/card-range/components/card-range-listing';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CardRangeListingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Card issuing',
    },
    {
      label: 'Card ranges',
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
          <CardRangeListing />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
