import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReactAdapterProvider, ReactAdapterService} from '../../../react/modules/adapter';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CustomFieldRuleDetails} from '../../../react/modules/custom-field-rules/components/custom-field-rules-details';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CustomFieldRulesDetailsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Administration',
    },
    {
      label: 'Custom field',
    },
    {
      label: 'Custom field rules',
      to: '/custom-field-rules',
    },
    {
      label: 'Custom field rule details',
    },
  ];
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(private route: ActivatedRoute, private adapter: ReactAdapterService) {}

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnDestroy(): void {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper?.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.route}>
          <CustomFieldRuleDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
