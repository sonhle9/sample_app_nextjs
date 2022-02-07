import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import * as _ from 'lodash';
import {convertEnumToObject} from '../../shared/common';
import {Reason, Types, PhysicalType} from '../../shared/enums';
import {MessageBag} from '../../../card-range/shared/validation';
import {FormFactor} from 'src/app/card-groups/shared/enum';
import {ICardReplacement, ICard} from 'src/shared/interfaces/card.interface';
import {ApiCardService} from 'src/app/api-cards.service';
import {EPhysicalType} from 'src/shared/enums/card.enum';
import {Validators} from '@angular/forms';
@Component({
  selector: 'app-card-replacement-modal',
  templateUrl: './card-replacement-modal.component.html',
  styleUrls: ['./card-replacement-modal.component.scss'],
})
export class CardReplacementModalComponent implements OnInit {
  loading = false;
  message: string;
  messageType: string;
  errorMessages: {[key: string]: string};
  form: AppFormGroup;
  cardId: string;
  isCheckFee = true;
  cardRanges: any[];
  formFactor: any[] = this.getFormFactorList();
  reasons: any[] = convertEnumToObject(Reason, true);
  physicalTypes = [];

  constructor(
    fb: AppFormBuilder,
    @Inject(MAT_DIALOG_DATA) data: ICard,
    private dialogRef: MatDialogRef<CardReplacementModalComponent>,
    private readonly apiCardsService: ApiCardService, // private readonly apiCardRangeService: ApiCardRangeService,
  ) {
    this.initForm(fb, data);
    Object.values(EPhysicalType).forEach((value) => {
      if (value !== PhysicalType.Scratch || data.type !== Types.Fleet) {
        this.physicalTypes.push(value);
      }
    });
  }

  ngOnInit() {
    // this.fetchCardRanges();
  }

  initForm(fb: AppFormBuilder, data?: ICard) {
    this.form = fb.group({
      formFactor: [data.formFactor],
      fee: [],
      reason: [''],
      remark: [''],
      physicalType: data.physicalType ? data.physicalType : null,
    });
    if (data.formFactor === FormFactor.Virtual) {
      this.form.controls['physicalType'].disable();
    }
    this.cardId = data.id;
    this.errorMessages = AppValidators.initErrorMessageObject(this.form);
  }

  onFormFactorChange(formFactor) {
    if (formFactor === FormFactor.Virtual) {
      this.form.controls['physicalType'].disable();
      this.form.controls['physicalType'].setValue(null);
      this.isCheckFee = false;
    } else {
      this.isCheckFee = true;
      this.form.controls['physicalType'].enable();
      this.form.controls['physicalType'].setValidators(Validators.required);
    }
  }

  onChangeFee(fee) {
    if (fee === true) {
      this.isCheckFee = true;
      this.form.controls['formFactor'].setValue(FormFactor.Physical);
    } else {
      this.isCheckFee = false;
      this.form.controls['formFactor'].setValue(FormFactor.Virtual);
      this.form.controls['fee'].setValue('');
    }
  }

  onSubmit() {
    this.form.markAllAsDirty();
    this.errorMessages = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }
    const cardReplacementData = this.getCardReplacementUpdateModal();
    this.loading = true;
    this.message = this.messageType = '';
    this.apiCardsService.createCardReplacement(cardReplacementData).subscribe(
      () => {
        this.loading = false;
        this.dialogRef.close({
          message: 'success',
          type: 'replacement',
        });
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

  private getFormFactorList(): any[] {
    return convertEnumToObject(FormFactor, true);
  }

  private formatValidationErrors(errors: any): string {
    const errorMessages = new MessageBag(errors).all();
    return `Validation failed: ${errorMessages[0]}`;
  }

  private getCardReplacementUpdateModal(): ICardReplacement {
    const formValue: ICardReplacement = this.form.value;
    return {
      card: this.cardId,
      formFactor: formValue.formFactor,
      ...(formValue.physicalType && {physicalType: formValue.physicalType}),
      ...(formValue.fee && {fee: formValue.fee}),
      reason: formValue.reason,
      ...(formValue.remark && {remark: formValue.remark.trim()}),
    } as ICardReplacement;
  }
}
