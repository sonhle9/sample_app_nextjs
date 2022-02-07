import {ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';

import {AuthService} from '../../../auth.service';
import {Subject} from 'rxjs';
import {AppFormGroup, AppFormBuilder, AppValidators} from '../../../../shared/helpers/formGroup';
import {takeUntil} from 'rxjs/operators';
import {AppEmitter} from '../../../emitter.service';

@Component({
  selector: 'app-reset-password-create-otp',
  templateUrl: 'reset.html',
  styleUrls: ['../shared/auth.scss'],
})
export class PasswordRecoveryResetComponent implements OnInit {
  loading = false;
  errorMessage;
  serverErrors;
  form: AppFormGroup;

  allSub: Subject<any> = new Subject<any>();
  phone;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: AppFormBuilder,
  ) {
    this.form = this.fb.group(
      {
        otp: ['', [Validators.required, AppValidators.numberOnly, AppValidators.fixedNumber(6)]],
        password1: ['', [Validators.required]],
        password2: ['', [Validators.required]],
      },
      {
        validator: (form) => {
          AppValidators.mustSame(form.controls.password1, form.controls.password2);
        },
      },
    );
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
  }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.allSub)).subscribe((params) => {
      this.phone = params.phone;
    });
  }

  resetPassword() {
    this.serverErrors = '';
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const phone = this.phone;
    const otp = +this.form.value.otp;
    const password = this.form.value.password1;

    this.authService
      .resetPassword(phone, otp, password)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.loading = false;
          AppEmitter.get(AppEmitter.SessionExpired).emit();
        },
        () => {
          this.loading = false;
          this.serverErrors = 'Invalid OTP';
        },
      );
  }
}
