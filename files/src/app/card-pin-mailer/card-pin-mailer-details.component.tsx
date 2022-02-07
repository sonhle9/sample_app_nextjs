import {AfterViewInit, OnDestroy} from '@angular/core';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import React from 'react';
import ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterService, ReactAdapterProvider} from 'src/react/modules/adapter';
import CardPinMailerDetails from 'src/react/modules/card-pin-mailer/components/card-pin-mailer-details';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CardPinMailerDetailsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Card issuing',
    },
    {
      to: 'card-issuing/card-pin-mailer',
      label: 'Card PIN mailer',
    },
    {
      label: 'Card PIN mailer details',
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
          <CardPinMailerDetails id={this.activatedRoute.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
