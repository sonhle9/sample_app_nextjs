import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Subject} from 'rxjs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {LoginForm} from 'src/react/modules/auth/components/login-form';
import {STORAGE_SESSION_MESSAGE_KEY} from 'src/shared/enums/session-storage.enum';
import {I2FALoginInput} from 'src/shared/interfaces/auth.interface';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'app-login',
  template: '<div #container></div>',
  // styleUrls: ['../shared/auth.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  errorMessage;
  serverErrors;
  messageCode: string;

  returnUrl?: string;

  allSub: Subject<any> = new Subject<any>();

  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private adapterService: ReactAdapterService,
  ) {}

  ngOnInit() {
    this.returnUrl = atob(this.route.snapshot.queryParams?.returnUrl || '');
    this.messageCode = sessionStorage.getItem(STORAGE_SESSION_MESSAGE_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_MESSAGE_KEY);
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
    this.allSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.render();
  }

  login = (data: {email: string; password: string}) =>
    this.authService.login(data.email, data.password).toPromise();

  login2FA = (input: I2FALoginInput) => this.authService.login2FA(input).toPromise();

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapterService} activatedRoute={this.route}>
          <LoginForm
            login={this.login}
            login2FA={this.login2FA}
            isConciergeAdmin={this.authService.isConciergeAdmin.bind(this.authService)}
            returnUrl={this.returnUrl}
            messageCode={this.messageCode}
          />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
