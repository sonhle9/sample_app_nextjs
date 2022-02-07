import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import React from 'react';
import ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import CardPinMailerList from 'src/react/modules/card-pin-mailer/components/card-pin-mailer-list';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CardPinMailerListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Card issuing',
    },
    {
      label: 'Card PIN mailer',
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private adapterService: ReactAdapterService,
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
          <CardPinMailerList />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
