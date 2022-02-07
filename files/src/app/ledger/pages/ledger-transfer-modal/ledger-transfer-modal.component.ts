import {Component, Inject, OnInit} from '@angular/core';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {AuthService} from '../../../auth.service';
import {ISessionData} from '../../../../shared/interfaces/auth.interface';
import {ApiLedgerService} from '../../../api-ledger.service';

@Component({
  selector: 'app-ledger-transfer-modal',
  templateUrl: './ledger-transfer-modal.component.html',
  styleUrls: ['./ledger-transfer-modal.component.scss'],
})
export class LedgerTransferModalComponent implements OnInit {
  loading = true;
  form: AppFormGroup;
  transferData: any;
  sessionData: ISessionData;

  constructor(
    private dialogRef: MatDialogRef<LedgerTransferModalComponent>,
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
          AppValidators.max(data.max),
        ],
      ],
      reason: [''],
    });
    if (data) {
      this.transferData = data;
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
    const reason = this.form.value.reason;
    const amount = Number(this.form.value.adjustmentValue);

    if (!this.sessionData && !this.sessionData.sub) {
      this.closeWithError('User does not exist');
    }

    this.apiLedgerService.transferToOperating(amount, reason).subscribe(
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

  onClose(): void {
    this.dialogRef.close();
  }

  closeWithError(message: string) {
    this.dialogRef.close(message);
  }
}
