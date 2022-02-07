import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {EditMode} from '../../shared/enum';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {Validators} from '@angular/forms';
import * as _ from 'lodash';
import {convertEnumToObject} from '../../../cards/shared/common';
import {Types} from '../../../cards/shared/enums';
import {ICardRange} from '../../../../shared/interfaces/card-range.interface';
import {CardRangeModalData} from '../../shared/models';
import {ApiCardRangeService} from '../../../../app/api-card-range.service';
import {MessageBag} from '../../shared/validation';
import moment from 'moment';
import {EType} from 'src/shared/enums/card.enum';

@Component({
  selector: 'app-card-range-modal',
  templateUrl: './card-range-modal.component.html',
  styleUrls: ['./card-range-modal.component.scss'],
})
export class CardRangeModalComponent implements OnInit {
  loading = false;
  message: string;
  messageType: string;
  errorMessages: {[key: string]: string};
  errorMessageEndNumber: {[key: string]: string};
  errorEndNumber: boolean;

  checkCurrentNumber = false;
  form: AppFormGroup;

  mode: EditMode;
  totalNumber = 0;
  merchants: any[] = [];
  cardRangeId: string;
  prefixCardNumber = '708381';
  types: any[] = this.getTypeList();
  createdAt: string;
  updatedAt: string;

  constructor(
    private dialogRef: MatDialogRef<CardRangeModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: CardRangeModalData,
    private readonly apiMerchantsService: ApiMerchantsService,
    fb: AppFormBuilder,
    private readonly apiCardRangeService: ApiCardRangeService,
  ) {
    this.initForm(fb, data);
  }

  ngOnInit() {
    if (this.mode === EditMode.EDIT) {
      this.form.controls['name'].disable();
      if (this.form.controls['currentNumber'].value) {
        this.checkCurrentNumber = true;
        this.form.controls['startNumber'].disable();
      }
    }
    this.form.controls['currentNumber'].disable();
  }

  initForm(fb: AppFormBuilder, data?: CardRangeModalData) {
    const currentNumber = data.cardRangeData?.currentNumber?.slice(6);
    this.form = fb.group({
      type: [EType.GIFT, [Validators.required]],
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]],
      description: ['', Validators.pattern('^[A-Za-z0-9 ]+$')],
      startNumber: ['', [Validators.required]],
      currentNumber: [''],
      endNumber:
        currentNumber?.length > 0
          ? ['', [Validators.required]]
          : ['', [Validators.required, AppValidators.biggerThan(Number(currentNumber))]],
    });
    if (data.mode === EditMode.EDIT) {
      this.cardRangeId = data.cardRangeId;
      this.form.patchValue(data.cardRangeData);
      this.createdAt = data.cardRangeData.createdAt;
      this.updatedAt = data.cardRangeData.updatedAt || '';
      this.totalNumber =
        Number(data.cardRangeData.endNumber) - Number(data.cardRangeData.startNumber);
      this.form.valueChanges.subscribe(() => this.validateForm());
    } else {
      this.createdAt = moment(Date.now()).format('LLL');
    }
    this.mode = data.mode;
    this.errorMessages = AppValidators.initErrorMessageObject(this.form);
  }

  validateForm() {
    this.form.markAllAsDirty();
    this.errorMessageEndNumber = AppValidators.getErrorMessageObject(this.form);
  }

  fetchMerchants() {
    const searchValue = this.form.controls.merchantId.value;
    this.apiMerchantsService
      .indexMerchants(
        0,
        25,
        searchValue
          ? {
              searchValue,
            }
          : null,
      )
      .subscribe((value) => {
        this.merchants = value.items;
      });
  }

  onSubmit() {
    this.form.markAllAsDirty();
    this.errorMessages = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }
    const cardRangeData = this.getCardRangeUpdateModel();

    this.loading = true;
    this.message = this.messageType = '';
    this.apiCardRangeService.createOrOpdateCardRange(cardRangeData).subscribe(
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

  private formatValidationErrors(errors: any): string {
    const errorMessages = new MessageBag(errors).all();
    return `Validation failed: ${errorMessages[0]}`;
  }

  onKeyPressInput(e) {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault();
    }
  }

  onChangeEndNumber(endNumber: number) {
    this.totalNumber = endNumber - this.form.controls['startNumber'].value;
  }

  onChangeTotalNumber(totalNumber: number) {
    const endNumber = Number(this.form.controls['startNumber'].value) - -totalNumber;
    const countEndNumber = endNumber.toString().length;
    let str = '';
    for (let i = 0; i < 10 - countEndNumber; i++) {
      str += '0';
    }
    this.form.controls['endNumber'].setValue(str + endNumber);
  }

  onChangeStartNumber(startNumber: number) {
    this.totalNumber = this.form.controls['endNumber'].value - startNumber;
  }

  fnChangeShowName = (str: string) => {
    return _.isString(str)
      ? (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).split('_').join(' ')
      : str;
  };

  private getCardRangeUpdateModel(): ICardRange {
    const formValue: ICardRange = this.form.value;
    this.form.controls['name'].setValue(formValue.name ? formValue.name.trim() : '');
    this.form.controls['name'].updateValueAndValidity();
    if (this.mode === EditMode.EDIT) {
      return {
        id: this.cardRangeId,
        description: formValue.description.trim(),
        ...(this.form.controls['currentNumber'].value === '' && {
          startNumber: this.prefixCardNumber + formValue.startNumber,
        }),
        endNumber: this.prefixCardNumber + formValue.endNumber,
      } as ICardRange;
    } else {
      return {
        type: formValue.type,
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        startNumber: this.prefixCardNumber + formValue.startNumber,
        endNumber: this.prefixCardNumber + formValue.endNumber,
      } as ICardRange;
    }
  }
}
