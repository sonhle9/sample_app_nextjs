import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {isEmptyOrUndefined} from 'src/shared/helpers/common';
import {AppFormBuilder, AppFormGroup} from 'src/shared/helpers/formGroup';
import {
  ApiBlacklistService,
  ICustomerLimitation,
  IDailyCustomer,
} from '../../../api-blacklist-service';

@Component({
  selector: 'app-customer-limitations-modal',
  templateUrl: './customerLimitationsModal.component.html',
  styleUrls: ['./customerLimitationsModal.component.scss'],
})
export class CustomerLimitationsModalComponent implements OnInit {
  loading = false;

  form: AppFormGroup;

  data: any;

  constructor(
    private dialogRef: MatDialogRef<CustomerLimitationsModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: Partial<IDailyCustomer>,
    fb: AppFormBuilder,
    private readonly apiBlacklistService: ApiBlacklistService,
  ) {
    this.data = data;
    this.form = fb.group({
      chargeLimit: [this.data.chargeLimit],
      numberTransactionLimit: [this.data.numberTransactionLimit],
      maxTransactionAmount: [this.data.maxTransactionAmount],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const updateData: Partial<ICustomerLimitation> = {};
    if (!isEmptyOrUndefined(this.form.controls.chargeLimit.value)) {
      updateData.chargeLimit = Number(this.form.controls.chargeLimit.value.toFixed(2));
    }

    if (!isEmptyOrUndefined(this.form.controls.maxTransactionAmount.value)) {
      updateData.maxTransactionAmount = Number(
        this.form.controls.maxTransactionAmount.value.toFixed(2),
      );
    }

    if (!isEmptyOrUndefined(this.form.controls.numberTransactionLimit.value)) {
      updateData.numberTransactionLimit = Number(this.form.controls.numberTransactionLimit.value);
    }

    this.apiBlacklistService.updateDailyCustomerLimitations(this.data.userId, updateData).subscribe(
      (res) => {
        this.loading = false;
        this.dialogRef.close({isSuccess: true, data: res});
      },
      (err) => {
        this.loading = false;
        console.log(err);
        this.dialogRef.close({
          isSuccess: false,
          data: err.error.message
            ? err.error.message.toString()
            : 'Some error was occurred, please try again',
        });
      },
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
