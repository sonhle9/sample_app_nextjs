import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LoginComponent} from './pages/login/login';
import {PasswordRecoveryResetComponent} from './pages/reset/reset';
import {PasswordRecoveryCreateOtpComponent} from './pages/createOtp/createOtp';
import {AuthRoutingModule} from './auth-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password';
import {ResetPasswordComponent} from './pages/reset-password/reset-password';

@NgModule({
  declarations: [
    LoginComponent,
    PasswordRecoveryResetComponent,
    PasswordRecoveryCreateOtpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [ComponentsModule, ReactiveFormsModule, FormsModule, CommonModule, AuthRoutingModule],
  providers: [],
})
export class AuthModule {}
