import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BridgeComponent} from 'src/shared/interfaces/bridge-component.interface';
import ReactDOM from 'react-dom';
import React from 'react';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {VoucherDetails} from 'src/react/modules/vouchers/voucher-details/voucher-details';

@Component({
  template: '<div #container ></div>',
})
export class VouchersDetailsComponent implements BridgeComponent {
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
          <VoucherDetails voucherCode={this.route.snapshot.paramMap.get('code')} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
