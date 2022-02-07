import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {ReferralLeaderboardListing} from 'src/react/modules/rewards/components/rewards-leaderboard-listing';
import {BridgeComponent} from 'src/shared/interfaces/bridge-component.interface';

@Component({
  template: '<div #container></div>',
})
export class LeaderboardComponent implements BridgeComponent {
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
          <ReferralLeaderboardListing />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
