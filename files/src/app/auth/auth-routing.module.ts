import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './pages/login/login';
import {PasswordRecoveryCreateOtpComponent} from './pages/createOtp/createOtp';
import {PasswordRecoveryResetComponent} from './pages/reset/reset';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password';
import {ResetPasswordComponent} from './pages/reset-password/reset-password';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'passwords',
    children: [
      {
        path: 'request-otp',
        component: PasswordRecoveryCreateOtpComponent,
      },
      {
        path: 'reset',
        component: PasswordRecoveryResetComponent,
      },
    ],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
