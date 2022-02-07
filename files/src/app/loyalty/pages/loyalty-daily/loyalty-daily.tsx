import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {LoyaltyDaily} from 'src/react/modules/loyalty/components/loyalty-daily/loyalty-daily';

@Component({
  template: '<div #container></div>',
})
export class LoyaltyDailyComponent implements AfterViewInit, OnDestroy {
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
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <LoyaltyDaily />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
