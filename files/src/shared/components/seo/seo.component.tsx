import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Seo} from 'src/react/components/seo';

@Component({
  selector: 'app-seo',
  template: '<div #container></div>',
})
export class SeoComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input()
  pageTitle: string;

  @Input()
  appendString = '';

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
    if (this.wrapper && this.wrapper.nativeElement && this.pageTitle) {
      ReactDOM.render(
        <Seo title={this.pageTitle + this.appendString} />,
        this.wrapper.nativeElement,
      );
    }
  }
}
