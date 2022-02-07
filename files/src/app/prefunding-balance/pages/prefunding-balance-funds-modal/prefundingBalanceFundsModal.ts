import {Component, Inject, OnInit} from '@angular/core';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {AuthService} from '../../../auth.service';
import {ISessionData} from '../../../../shared/interfaces/auth.interface';
import {ApiLedgerService} from '../../../api-ledger.service';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {TransactionType} from '../../../../shared/enums/merchant.enum';
import {SETEL_MERCHANT_ID} from '../../../merchants/shared/constants';

@Component({
  selector: 'app-prefunding-funds-modal',
  templateUrl: './prefundingBalanceFundsModal.html',
  styleUrls: ['./prefundingBalanceFundsModal.scss'],
})
export class PrefundingBalanceFundsModalComponent implements OnInit {
  loading = true;
  form: AppFormGroup;
  transferData: any;
  sessionData: ISessionData;

  constructor(
    private dialogRef: MatDialogRef<PrefundingBalanceFundsModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    fb: AppFormBuilder,
    private readonly apiLedgerService: ApiLedgerService,
    private readonly apiMerchantsService: ApiMerchantsService,
    private authService: AuthService,
  ) {
    this.form = fb.group({
      adjustmentValue: [
        0,
        [
          Validators.required,
          AppValidators.isValidNumber(),
          AppValidators.biggerThan(),
          AppValidators.numberDecimal(2),
          AppValidators.notEquals(0),
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

    const adjustmentData = {
      userId: this.sessionData.sub, // admin user id
      merchantId: SETEL_MERCHANT_ID, // adjusted merchant id
      type: TransactionType.ADJUSTMENT, // type
      currency: 'MYR', // currency
      attributes: {
        comment: reason ? reason : '',
      },
      amount, // adjustment amount
    };

    this.apiLedgerService.adjustBufferBalance(-amount, reason).subscribe(
      () => {
        this.apiMerchantsService.createAdjustmentTransaction(adjustmentData).subscribe(
          () => {
            this.apiMerchantsService.topupSetelPrepaid(amount).subscribe(
              () => {
                this.loading = false;
                this.dialogRef.close('success');
              },
              (err) => {
                this.loading = false;
                this.dialogRef.close(err);
              },
            );
          },
          (err) => {
            this.loading = false;
            this.dialogRef.close(err);
          },
        );
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
