import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {ApiPaymentsService} from 'src/app/api-payments.service';

@Component({
  moduleId: module.id,
  selector: 'app-grant-wallet',
  templateUrl: 'grantWallet.html',
  styleUrls: ['grantWallet.scss'],
})
export class GrantWalletComponent implements OnDestroy {
  @Input()
  customerId: string;
  @Output()
  added: EventEmitter<any> = new EventEmitter<any>();

  loading = false;

  form: AppFormGroup;
  errorMessage;

  messageContent: string;
  messageType: string;
  tags = [];

  allSub: Subject<any> = new Subject<any>();

  constructor(private fb: AppFormBuilder, private paymentService: ApiPaymentsService) {
    this.form = this.fb.group({
      amount: [
        '',
        [Validators.required, AppValidators.decimalOnly, AppValidators.maxTopupAmount(2000)],
      ],
      message: ['', [Validators.required]],
      expiryDate: ['', [AppValidators.greaterThanNowDate]],
    });
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
    this.form.valueChanges.subscribe(() => this.validateForm());
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  grantBalance() {
    this.validateForm();
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const {amount, message, expiryDate} = this.form.value;
    this.paymentService
      .grantWallet(this.customerId, +amount, message, this.tags, expiryDate)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (transaction) => {
          this.loading = false;
          this.messageContent = 'Wallet amount was successfully granted.';
          this.messageType = '';
          this.reset();
          this.added.emit(transaction);
        },
        () => {
          this.loading = false;
          this.messageContent = 'Ops! Wallet amount unable to grant.';
          this.messageType = 'error';
        },
      );
  }

  reset() {
    this.form.patchValue({
      amount: '',
      message: '',
      expiryDate: '',
    });
    this.tags = [];
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].setErrors(null);
    });
  }

  validateForm() {
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);
  }
}
