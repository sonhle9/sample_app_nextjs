import {AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';

@Directive({
  selector: '[appReactComponent]',
})
export class ReactComponentDirective<T> implements AfterViewInit, OnDestroy, OnChanges {
  @Input('appReactComponent') reactComponent: React.ComponentType<T>;
  @Input() reactProps: T;
  constructor(
    private el: ElementRef,
    private adapter: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    this.render();
  }

  ngOnChanges() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.el.nativeElement);
  }

  render() {
    if (this.el && this.el.nativeElement && this.reactComponent) {
      const ChildComponent = this.reactComponent;
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.activatedRoute}>
          <ChildComponent {...this.reactProps} />
        </ReactAdapterProvider>,
        this.el.nativeElement,
      );
    }
  }
}
