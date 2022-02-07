import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {ReactAdapterProvider, ReactAdapterService} from '../../../../react/modules/adapter';
import ReactDOM from 'react-dom';
import React from 'react';
import {Subject} from 'rxjs';
import {CreatePasswordForm} from '../../../../react/modules/auth/components/create-password-form';
import {PasswordFormReasonEnum} from '../../../../react/modules/auth/auth.service';
@Component({
  selector: 'app-reset-password',
  template: '<div #container></div>',
})
export class ResetPasswordComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  allSub: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adapterService: ReactAdapterService,
    private ngZone: NgZone,
  ) {
    this.navigateAfterChangePassword = this.navigateAfterChangePassword.bind(this);
  }
  ngAfterViewInit(): void {
    this.render();
  }

  ngOnDestroy(): void {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
    this.allSub.unsubscribe();
  }

  render() {
    const resetToken: string = this.route.snapshot.queryParamMap.get('token');
    const reasonCode: string =
      this.route.snapshot.queryParamMap.get('rc') || PasswordFormReasonEnum.USER_RESET_PASSWORD;
    const passwordExpiresIn: number = +this.route.snapshot.queryParamMap.get('ei');
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapterService} activatedRoute={this.route}>
          <CreatePasswordForm
            navigateAfterChangePassword={this.navigateAfterChangePassword}
            resetToken={resetToken}
            reasonCode={reasonCode}
            passwordExpiresIn={passwordExpiresIn}></CreatePasswordForm>
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }

  navigateAfterChangePassword(path: string[], extras?: NavigationExtras): void {
    this.ngZone.run(() => this.router.navigate(path, extras));
  }
}
