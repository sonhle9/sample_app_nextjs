import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ActivatedRoute} from '@angular/router';
import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {VariableDetails} from 'src/react/modules/variables/components/variable-details';

@Component({template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>'})
export class VariableDetailsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Experience',
    },
    {
      to: '/experience/variables',
      label: 'Variables',
    },
    {
      label: 'Variable details',
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
          <VariableDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
