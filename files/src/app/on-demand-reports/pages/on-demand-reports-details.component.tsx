import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {OnDemandReportsDetails} from 'src/react/modules/on-demand-reports/components/on-demand-reports-details';

@Component({
  template: '<div #container></div>',
})
export class OnDemandReportsDetailsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(private route: ActivatedRoute, private adapterService: ReactAdapterService) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapterService} activatedRoute={this.route}>
          <OnDemandReportsDetails id={this.route.snapshot.paramMap.get('id')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
