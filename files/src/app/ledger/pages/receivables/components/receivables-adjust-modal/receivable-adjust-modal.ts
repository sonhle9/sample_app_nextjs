import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {
  AppFormGroup,
  AppFormBuilder,
  AppValidators,
} from '../../../../../../shared/helpers/formGroup';
import {ISessionData} from '../../../../../../shared/interfaces/auth.interface';
import {ApiLedgerService} from '../../../../../api-ledger.service';
import {AuthService} from '../../../../../auth.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-receivables-adjust-modal',
  templateUrl: './receivables-adjust-modal.html',
  styleUrls: ['./receivables-adjust-modal.scss'],
})
export class ReceivablesAdjustModalComponent implements OnInit, OnDestroy {
  loading = true;
  form: AppFormGroup;
  adjustmentData: any;
  sessionData: ISessionData;
  validator = [Validators.required, AppValidators.notZero, AppValidators.numberDecimal(2)];
  allSub: Subject<any> = new Subject<any>();

  constructor(
    private dialogRef: MatDialogRef<ReceivablesAdjustModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    fb: AppFormBuilder,
    private readonly apiLedgerService: ApiLedgerService,
    private authService: AuthService,
  ) {
    this.form = fb.group({
      totalAmount: [0, this.validator],
      totalFeeAmount: [0, this.validator],
      adjustmentAmount: [{value: 0, disabled: true}, this.validator],
    });

    if (data) {
      this.adjustmentData = data;
      this.form.patchValue(this.adjustmentData);
    }

    this.sessionData = this.authService.getSessionData();
  }

  ngOnInit(): void {
    this.loading = false;
    this.form.controls.totalAmount.valueChanges.subscribe((value) => {
      const adjustmentAmount = parseFloat(value) - parseFloat(this.form.value.totalFeeAmount);
      this.form.controls.adjustmentAmount.patchValue(adjustmentAmount.toFixed(2));
    });
    this.form.controls.totalFeeAmount.valueChanges.subscribe((value) => {
      const adjustmentAmount = parseFloat(this.form.value.totalAmount) - parseFloat(value);
      this.form.controls.adjustmentAmount.patchValue(adjustmentAmount.toFixed(2));
    });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
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
    const values = this.form.getRawValue();
    const totalAmount = Number(values.totalAmount);
    const totalFeeAmount = Number(values.totalFeeAmount);
    const adjustmentAmount = Number(values.adjustmentAmount);

    if (!this.sessionData && !this.sessionData.sub) {
      this.closeWithError('User does not exist');
    }

    this.apiLedgerService
      .adjustReceivable(
        this.adjustmentData.receivableId,
        adjustmentAmount,
        totalAmount,
        totalFeeAmount,
      )
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.loading = false;
          this.dialogRef.close({
            status: 'success',
            receivable: res,
          });
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
