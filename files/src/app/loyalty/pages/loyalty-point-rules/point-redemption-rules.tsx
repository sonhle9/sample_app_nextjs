import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BridgeComponent} from 'src/shared/interfaces/bridge-component.interface';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {PointRedemptionRules} from 'src/react/modules/loyalty/components/point-rules/point-redemption-rules';

@Component({
  template: '<div #container></div>',
})
export class PointRedemptionRulesComponent implements BridgeComponent {
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
          <PointRedemptionRules />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
