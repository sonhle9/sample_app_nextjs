import {Component, Inject, OnInit} from '@angular/core';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {AuthService} from '../../../auth.service';
import {ISessionData} from '../../../../shared/interfaces/auth.interface';
import {ApiLedgerService} from '../../../api-ledger.service';
import {AccountsGroup, AggregatesAccounts} from '../../ledger-accounts.enum';

@Component({
  selector: 'app-ledger-adjust-modal',
  templateUrl: './ledger-adjust-modal.component.html',
  styleUrls: ['./ledger-adjust-modal.component.scss'],
})
export class LedgerAdjustModalComponent implements OnInit {
  loading = true;
  form: AppFormGroup;
  accountData: any;
  sessionData: ISessionData;

  constructor(
    private dialogRef: MatDialogRef<LedgerAdjustModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    fb: AppFormBuilder,
    private readonly apiLedgerService: ApiLedgerService,
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
      reason: [''],
    });

    if (data) {
      this.accountData = data;
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
    this.loading = true;
    const reason = this.form.value.reason;
    const amount = Number(this.form.value.adjustmentValue);

    if (!this.sessionData && !this.sessionData.sub) {
      this.closeWithError('User does not exist');
    }

    const adjustmentData = {
      account: this.accountData.account,
      balanceType: this.accountData.groupBalanceType,
      amount,
      reason: reason || '',
    };

    if (this.accountData.accountGroup === AccountsGroup.PLATFORM) {
      this.adjustPlatformAccount(adjustmentData);
    }
    if (this.accountData.accountGroup === AccountsGroup.AGGREGATES) {
      this.adjustAggregatesAccount(adjustmentData);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  closeWithError(message: string) {
    this.dialogRef.close(message);
  }

  adjustPlatformAccount(adjustmentData) {
    this.apiLedgerService.adjustPlatformAccount(adjustmentData).subscribe(
      () => {
        this.loading = false;
        this.dialogRef.close('success');
      },
      (err) => {
        this.loading = false;
        this.dialogRef.close(err);
      },
    );
  }

  adjustAggregatesAccount(adjustmentData) {
    const {amount, reason} = adjustmentData;
    if (adjustmentData.account === AggregatesAccounts.buffer) {
      this.apiLedgerService.adjustBufferBalance(amount, reason).subscribe(
        () => {
          this.loading = false;
          this.dialogRef.close('success');
        },
        (err) => {
          this.loading = false;
          this.dialogRef.close(err);
        },
      );
    }
  }
}
