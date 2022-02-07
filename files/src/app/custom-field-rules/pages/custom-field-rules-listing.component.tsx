import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ReactAdapterProvider, ReactAdapterService} from '../../../react/modules/adapter';
import {ActivatedRoute} from '@angular/router';
import React from 'react';
import {CustomFieldRulesListing} from '../../../react/modules/custom-field-rules/components/custom-field-rules-listing';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import * as ReactDOM from 'react-dom';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CustomFieldRulesListingComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Administration',
    },
    {
      label: 'Custom field',
    },
    {
      label: 'Custom field rules',
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
          <CustomFieldRulesListing />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
