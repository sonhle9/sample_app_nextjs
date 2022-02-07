import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {CompanyDetails} from 'src/react/modules/company/components/company-details';
import {BreadcrumbItem} from '../../../../react/components/app-breadcrumbs';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CompanyDetailsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [];
  tabLabel = '';

  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(private route: ActivatedRoute, private adapter: ReactAdapterService) {}

  ngAfterViewInit() {
    this.render();
    this.route.queryParams.subscribe(() => {
      this.updateBreadcrumbs();
    });

    this.route.url.subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  updateBreadcrumbs() {
    this.tabLabel = this.route.snapshot.queryParamMap.get('tab');
    this.breadcrumbs = [
      {
        label: 'Businesses',
      },
      {
        label: 'Companies',
      },
      {
        label: this.tabLabel || 'Company details',
      },
    ];
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.route}>
          <CompanyDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
