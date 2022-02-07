import {AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, ViewChild} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NotificationDisplay} from 'src/react/hooks/use-notification';

@Component({
  selector: 'app-notification',
  template: '<div #container></div>',
})
export class NotificationComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.render();
  }

  ngOnChanges() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(<NotificationDisplay />, this.wrapper.nativeElement);
    }
  }
}
