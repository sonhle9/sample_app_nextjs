import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {Validators} from '@angular/forms';

import {AuthService} from '../../../auth.service';
import {AppFormGroup, AppFormBuilder, AppValidators} from '../../../../shared/helpers/formGroup';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-password-recovery-create-otp',
  templateUrl: 'createOtp.html',
  styleUrls: ['../shared/auth.scss'],
})
export class PasswordRecoveryCreateOtpComponent {
  loading = false;
  errorMessage;
  serverErrors;
  form: AppFormGroup;

  allSub: Subject<any> = new Subject<any>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: AppFormBuilder,
  ) {
    this.form = this.fb.group({
      phone: ['', [Validators.required, AppValidators.numberOnly, AppValidators.fixedNumber(12)]],
    });
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }

  ngOnDestory() {
    this.allSub.unsubscribe();
  }

  createOtp() {
    this.serverErrors = '';
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const phone = this.form.value.phone;

    this.authService
      .createOtp(phone)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.router.navigate([`/passwords/reset`], {queryParams: {phone}});
        },
        () => {
          this.router.navigate([`/passwords/reset`], {queryParams: {phone}});
        },
      );
  }
}
