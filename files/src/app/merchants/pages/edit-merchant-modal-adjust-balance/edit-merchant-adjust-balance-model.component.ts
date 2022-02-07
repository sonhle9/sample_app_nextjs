import {Component, Inject, OnInit} from '@angular/core';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {AuthService} from '../../../auth.service';
import {ISessionData} from '../../../../shared/interfaces/auth.interface';
import {TransactionType, MerchantBalanceType} from '../../../../shared/enums/merchant.enum';
import {getMerchantBalance} from '../../shared/helpers';
import {Currency} from '../../../../shared/enums/wallet.enum';
import {IMerchant} from '../../../../shared/interfaces/merchant.interface';

@Component({
  selector: 'app-edit-merchant-adjust-balance-modal',
  templateUrl: './edit-merchant-adjust-balance-model.component.html',
  styleUrls: ['./edit-merchant-adjust-balance-model.scss'],
})
export class EditMerchantAdjustBalanceModelComponent implements OnInit {
  loading = true;

  form: AppFormGroup;

  currency = 'MYR';

  merchantData: any;

  sessionData: ISessionData;

  constructor(
    private dialogRef: MatDialogRef<EditMerchantAdjustBalanceModelComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    fb: AppFormBuilder,
    private readonly apiMerchantsService: ApiMerchantsService,
    private authService: AuthService,
  ) {
    this.form = fb.group({
      adjustmentValue: [
        0,
        [
          Validators.required,
          AppValidators.isValidNumber(),
          AppValidators.notEquals(0),
          AppValidators.numberDecimal(2),
        ],
      ],
      comment: [''],
    });

    if (data) {
      this.merchantData = data;
      this.form.patchValue(data);
    }

    this.sessionData = this.authService.getSessionData();
  }

  ngOnInit(): void {
    this.loading = false;
  }

  getErrorMessages() {
    this.form.markAllAsDirty();
    return AppValidators.getErrorMessageObject(this.form);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const formValue = this.form.value;
    const adjustmentValue = Number(formValue.adjustmentValue);

    if (!this.sessionData && !this.sessionData.sub) {
      this.closeWithError('User was not existed');
    }

    const adjustmentData = {
      userId: this.sessionData.sub, // admin user id
      merchantId: this.merchantData.id, // adjusted merchant id
      type: TransactionType.ADJUSTMENT, // type
      currency: 'MYR', // currency
      attributes: {
        comment: formValue.comment ? formValue.comment : '',
      },
      amount: Number(adjustmentValue), // adjustment amount
    };

    this.apiMerchantsService.createAdjustmentTransaction(adjustmentData).subscribe(
      () => {
        this.loading = false;
        this.dialogRef.close('success');
      },
      (err) => {
        this.loading = false;
        if (err && err.error !== null) {
          this.dialogRef.close(err.error.message ? err.error.message : err.toString());
          return;
        }
        this.dialogRef.close('Something went wrong. Please try again');
      },
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  closeWithError(message: string) {
    this.dialogRef.close(message);
  }

  getMerchantAvailableBalance(merchant: IMerchant): number {
    return getMerchantBalance(merchant, MerchantBalanceType.AVAILABLE, Currency.MYR) || 0;
  }
}
