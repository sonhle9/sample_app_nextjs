import {Component, OnInit, Inject} from '@angular/core';

import {FuelType} from './../../stations/shared/const-var';
import {AppFormBuilder, AppFormGroup, AppValidators} from './../../../shared/helpers/formGroup';
import {Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FuelRecoveryService} from '../fuel-recovery.service';
import {Subject} from 'rxjs';
import {IFuelRecoveryInfo} from '../interface/fuel-recovery.interface';
import {MatRadioChange} from '@angular/material/radio';

@Component({
  selector: 'app-fuel-recovery-add-info-modal',
  templateUrl: './fuel-recovery-add-info-modal.component.html',
  styleUrls: ['./fuel-recovery-add-info-modal.component.scss'],
})
export class FuelRecoveryAddInfoModalComponent implements OnInit {
  fuelTypes: string[] = Object.values(FuelType);
  form: AppFormGroup;
  errorMessage: any;
  allSub: Subject<any> = new Subject<any>();
  chargedBy: string[] = ['amount', 'volume'];
  isChargedByAmount: boolean;
  isLoadingResults: boolean;
  message: string;
  messageType: string;

  constructor(
    private fb: AppFormBuilder,
    public dialogRef: MatDialogRef<FuelRecoveryAddInfoModalComponent>,
    private fuelRecoveryService: FuelRecoveryService,
    @Inject(MAT_DIALOG_DATA) public data: IFuelRecoveryInfo,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fuelType: ['', [Validators.required]],
      pricePerUnit: ['', [Validators.required]],
      completedVolume: ['', []],
      completedAmount: ['', []],
      transactionCompletedAt: [this.data.createdAt, [Validators.required]],
    });
    this.isChargedByAmount = true;
    this.form.get('completedAmount').setValidators(Validators.required);
  }

  onChargesType(event: MatRadioChange) {
    if (event.value === 'amount') {
      this.form.get('completedAmount').setValidators(Validators.required);
      this.form.get('completedVolume').clearValidators();
      this.isChargedByAmount = true;
    }

    if (event.value === 'volume') {
      this.form.get('completedVolume').setValidators(Validators.required);
      this.form.get('completedAmount').clearValidators();
      this.isChargedByAmount = false;
    }
    this.form.get('completedAmount').updateValueAndValidity();
    this.form.get('completedVolume').updateValueAndValidity();
  }

  onSubmit() {
    const orderId = this.data.orderId;
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }

    this.fuelRecoveryService.updateRecoveryInfo(orderId, this.form.value).subscribe(
      () => {
        this.dialogRef.close('success');
      },
      (err) => {
        this.isLoadingResults = false;
        this.messageType = 'error';
        this.message = err.error.message.message;
      },
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  get fuelType() {
    return this.form.get('fuelType');
  }
  get pricePerUnit() {
    return this.form.get('pricePerUnit');
  }
  get completedVolume() {
    return this.form.get('completedVolume');
  }
  get completedAmount() {
    return this.form.get('completedAmount');
  }
  get transactionCompletedAt() {
    return this.form.get('transactionCompletedAt');
  }
}
