import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {VehicleBrandListing} from 'src/react/modules/vehicle-directory/components/vehicle-brand-listing';

@Component({
  template: '<div #container></div>',
})
export class VehicleBrandListingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(private adapter: ReactAdapterService, private activatedRoute: ActivatedRoute) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.activatedRoute}>
          <VehicleBrandListing />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
