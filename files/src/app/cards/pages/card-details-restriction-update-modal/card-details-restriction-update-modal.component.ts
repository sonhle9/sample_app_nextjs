import {Component, Inject, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ApiCardService} from 'src/app/api-cards.service';
import {AppFormBuilder, AppFormGroup} from 'src/shared/helpers/formGroup';
import {AllowedFuelProducts} from '../../shared/enums';
import {ICard, ILimitation} from 'src/shared/interfaces/card.interface';
import {convertToSensitiveNumber, reverseSensitiveNumber} from '../../shared/common';

@Component({
  selector: 'app-card-details-restriction-update-modal',
  templateUrl: './card-details-restriction-update-modal.component.html',
  styleUrls: ['./card-details-restriction-update-modal.component.scss'],
})
export class CardDetailsRestrictionUpdateModalComponent implements OnInit {
  loading = true;
  form: AppFormGroup;
  dataCard: ICard;
  dataLimitation: ILimitation;
  allowedFuelProductList = Object.keys(AllowedFuelProducts);
  fakeSingleTransactionLimit: number;
  fakeDailyCardLimit: number;
  fakeMonthlyCardLimit: number;

  constructor(
    private dialogRef: MatDialogRef<CardDetailsRestrictionUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    fb: AppFormBuilder,
    private readonly apiCardService: ApiCardService,
  ) {
    const {card} = data;
    const {
      card: {limitation},
    } = data;
    this.dataCard = card;
    this.dataLimitation = limitation;
    this.fakeSingleTransactionLimit = limitation.singleTransactionLimit;
    this.fakeDailyCardLimit = limitation.dailyCardLimit;
    this.fakeMonthlyCardLimit = limitation.monthlyCardLimit;
    this.form = fb.group({
      singleTransactionLimit: [limitation.singleTransactionLimit, [Validators.min(0)]],
      dailyCardLimit: [limitation.dailyCardLimit, [Validators.min(0)]],
      monthlyCardLimit: [limitation.monthlyCardLimit, [Validators.min(0)]],
      dailyCountLimit: [limitation.dailyCountLimit, [Validators.min(0)]],
      monthlyCountLimit: [limitation.monthlyCountLimit, [Validators.min(0)]],
      allowedFuelProducts: [limitation.allowedFuelProducts],
    });
  }

  ngOnInit(): void {
    this.loading = false;
    this.onBlurRMInput('singleTransactionLimit');
    this.onBlurRMInput('dailyCardLimit');
    this.onBlurRMInput('monthlyCardLimit');
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const dataUpdate = {
      limitation: {
        ...this.form.value,
        singleTransactionLimit: reverseSensitiveNumber(
          this.form.controls['singleTransactionLimit'].value.slice(2, -3),
        ),
        dailyCardLimit: reverseSensitiveNumber(
          this.form.controls['dailyCardLimit'].value.slice(2, -3),
        ),
        monthlyCardLimit: reverseSensitiveNumber(
          this.form.controls['monthlyCardLimit'].value.slice(2, -3),
        ),
      },
      ...(this.dataCard.cardGroup && {cardGroup: this.dataCard.cardGroup.id}),
    };

    this.apiCardService.updateCard(this.dataCard.id, dataUpdate).subscribe(
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

  onKeyPressRMInput(e) {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault();
    }
  }

  onBlurRMInput(formControlName: string) {
    let value = this['fake' + formControlName.charAt(0).toUpperCase() + formControlName.slice(1)];
    value = convertToSensitiveNumber(value);
    this.form.controls[formControlName].setValue('RM' + value);
  }

  onFocusRMInput(formControlName: string) {
    this.form.controls[formControlName].setValue(
      this['fake' + formControlName.charAt(0).toUpperCase() + formControlName.slice(1)],
    );
  }

  onChangeRMInput(formControlName: string) {
    this['fake' + formControlName.charAt(0).toUpperCase() + formControlName.slice(1)] =
      this.form.controls[formControlName].value;
  }
}
