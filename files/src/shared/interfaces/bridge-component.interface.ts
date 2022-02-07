import {AfterViewInit, OnDestroy} from '@angular/core';

export interface BridgeComponent extends AfterViewInit, OnDestroy {
  render: () => void;
}
