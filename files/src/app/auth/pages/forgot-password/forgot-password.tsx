import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import ReactDOM from 'react-dom';
import React from 'react';
import {ForgotPasswordForm} from 'src/react/modules/auth/components/forgot-password-form';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  template: '<div #container></div>',
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  allSub: Subject<any> = new Subject<any>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private adapterService: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
  ) {}
  ngAfterViewInit(): void {
    this.render();
  }

  ngOnDestroy(): void {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
    this.allSub.unsubscribe();
  }

  ngOnInit(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider
          adapterService={this.adapterService}
          activatedRoute={this.activatedRoute}>
          <ForgotPasswordForm></ForgotPasswordForm>
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
