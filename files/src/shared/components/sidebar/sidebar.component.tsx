import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Sidebar} from 'src/react/components/sidebar';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {IMenuGroup} from 'src/shared/interfaces/core.interface';

@Component({
  selector: 'app-sidebar',
  template: '<div #container></div>',
})
export class SidebarComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input()
  menu: IMenuGroup[] = [];
  @Input()
  hidden = false;
  @Input()
  mainContent: HTMLDivElement;

  mainContentRef = React.createRef<HTMLElement>() as React.MutableRefObject<HTMLElement>;

  allSub: Subject<any> = new Subject<any>();

  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private adapter: ReactAdapterService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    this.render();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.render());
  }

  ngOnChanges() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    this.mainContentRef.current = this.mainContent;

    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.activatedRoute}>
          <Sidebar
            menus={this.menu}
            hidden={this.hidden}
            slideMenuTargetRef={this.mainContentRef}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
