import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {TerminalsDetails} from 'src/react/modules/setel-terminals/components/terminals-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class TerminalsDetailsComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [];
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  serialNum: string = this.activatedRoute.snapshot.params.serialNum;
  terminalType = '';
  ngAfterViewInit() {
    this.render();

    this.activatedRoute.queryParams.subscribe(() => {
      this.updateBreadcrumbs();
    });

    this.activatedRoute.url.subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  updateBreadcrumbs() {
    this.serialNum = this.activatedRoute.snapshot.params.serialNum;
    this.terminalType = this.activatedRoute.snapshot.queryParamMap.get('terminalType');
    this.breadcrumbs = [
      {
        label: 'Financial services',
      },
      {
        label: 'Terminal',
      },
      {
        label: 'Devices',
        to: '/terminal/devices/setel',
      },
      {
        label: this.terminalType?.split('-').join(' - '),
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
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <TerminalsDetails serialNum={this.serialNum} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
