import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {EditMode} from '../../../card-range/shared/enum';
import {ApiCardExpiryDateService} from '../../../api-card-expiry-date.service';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import * as _ from 'lodash';
import {convertEnumToObject} from '../../../cards/shared/common';
import {Types, FormFactor} from '../../../cards/shared/enums';
import {ICardExpiryDate} from '../../../../shared/interfaces/card-expiry-date.interface';
import {CardExpiryDateModalData} from '../../shared/models';
import {MessageBag} from '../../../card-range/shared/validation';
import {ApiCardRangeService} from 'src/app/api-card-range.service';
@Component({
  selector: 'app-card-expiry-date-modal',
  templateUrl: './card-expiry-date-modal.component.html',
  styleUrls: ['./card-expiry-date-modal.component.scss'],
})
export class CardExpiryDateModalComponent implements OnInit {
  loading = false;
  message: string;
  messageType: string;
  errorMessages: {[key: string]: string};
  form: AppFormGroup;
  mode: EditMode;
  cardExpiryDateId: string;
  cardRanges: any[];
  types: any[] = this.getTypeList();
  formFactor: any[] = this.getFormFactorList();

  constructor(
    fb: AppFormBuilder,
    @Inject(MAT_DIALOG_DATA) data: CardExpiryDateModalData,
    private dialogRef: MatDialogRef<CardExpiryDateModalComponent>,
    private readonly apiCardExpiryDateService: ApiCardExpiryDateService,
    private readonly apiCardRangeService: ApiCardRangeService,
  ) {
    this.initForm(fb, data);
  }

  ngOnInit() {
    this.fetchCardRanges();
  }

  initForm(fb: AppFormBuilder, data?: CardExpiryDateModalData) {
    this.form = fb.group({
      type: [''],
      formFactor: [FormFactor.Physical],
      cardRange: [''],
      expiryPeriod: [],
      autoRenewal: [],
    });
    if (data.mode === EditMode.EDIT) {
      this.cardExpiryDateId = data.cardExpiryDateId;
      this.form.patchValue(data.cardExpiryDateData);
    }
    this.mode = data.mode;
    this.errorMessages = AppValidators.initErrorMessageObject(this.form);
  }

  fetchCardRanges() {
    this.apiCardRangeService
      .indexCardRange(0, 100, {
        ...(this.form.controls['type'].value && {type: this.form.controls['type'].value}),
      })
      .subscribe((value) => {
        this.cardRanges = value.items;
      });
  }

  onSubmit() {
    this.form.markAllAsDirty();
    this.errorMessages = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }
    const cardExpiryDateData = this.getCardExpiryDateUpdateModal();

    this.loading = true;
    this.message = this.messageType = '';
    this.apiCardExpiryDateService.createOrUpdateCardExpiryDate(cardExpiryDateData).subscribe(
      () => {
        this.loading = false;
        this.dialogRef.close('success');
      },
      (err) => {
        this.loading = false;
        this.messageType = 'error';
        if (err.error) {
          const errorResponse = err.error;
          if (errorResponse.response && errorResponse.response.errors) {
            this.message = this.formatValidationErrors(errorResponse.response.errors);
          } else if (errorResponse.message) {
            this.message = errorResponse.message;
          } else {
            this.message = 'Something went wrong! Try again!';
          }

          if (errorResponse.errorCode) {
            this.message += ` (errorCode: ${errorResponse.errorCode})`;
          }
        } else {
          this.message = 'Something went wrong! Try again!';
        }
      },
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  private getTypeList(): any[] {
    return convertEnumToObject(Types, true);
  }

  private getFormFactorList(): any[] {
    return convertEnumToObject(FormFactor, true);
  }

  private formatValidationErrors(errors: any): string {
    const errorMessages = new MessageBag(errors).all();
    return `Validation failed: ${errorMessages[0]}`;
  }

  onKeyPressInput(e) {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault();
    }
  }

  fnChangeShowMode = (mode: EditMode) => {
    switch (mode) {
      case EditMode.ADD:
        return 'Add';
      case EditMode.EDIT:
        return 'Edit';
    }
  };

  private getCardExpiryDateUpdateModal(): ICardExpiryDate {
    const formValue: ICardExpiryDate = this.form.value;

    if (this.mode === EditMode.EDIT) {
      return {
        id: this.cardExpiryDateId,
        ...(formValue.expiryPeriod && {expiryPeriod: Number(formValue.expiryPeriod)}),
        ...(formValue.autoRenewal && {autoRenewal: Number(formValue.autoRenewal)}),
      } as ICardExpiryDate;
    } else {
      return {
        type: formValue.type,
        formFactor: formValue.formFactor,
        // cardRange: formValue.cardRange,
        ...(formValue.expiryPeriod && {expiryPeriod: Number(formValue.expiryPeriod)}),
        ...(formValue.autoRenewal && {autoRenewal: Number(formValue.autoRenewal)}),
      } as ICardExpiryDate;
    }
  }
}
