import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteContext} from 'src/react/routing/routing.context';
import React from 'react';
import * as ReactDOM from 'react-dom';
import {Profile} from 'src/react/modules/profile/profile';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {AuthService} from 'src/app/auth.service';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class ProfileComponent implements AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Profile',
    },
  ];
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService,
  ) {
    this.onChangePasswordSuccess = this.onChangePasswordSuccess.bind(this);
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper?.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider
          activatedRoute={this.activatedRoute}
          adapterService={this.adapterService}>
          <ActivatedRouteContext.Provider value={this.activatedRoute}>
            <Profile onChangePasswordSuccess={this.onChangePasswordSuccess} />
          </ActivatedRouteContext.Provider>
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
  onChangePasswordSuccess(): void {
    this.ngZone.run(() => {
      this.authService.logout().subscribe(() => this.router.navigate(['/login']));
    });
  }
}
