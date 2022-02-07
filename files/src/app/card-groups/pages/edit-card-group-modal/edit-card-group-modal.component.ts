import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EditCardGroupModalData} from '../../shared/models';
import {EditMode} from '../../shared/enum';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {Validators} from '@angular/forms';
import {MessageBag} from '../../shared/validation';
import * as _ from 'lodash';
import {convertEnumToObject} from '../../../../app/cards/shared/common';
import {Types, Levels} from '../../../../app/cards/shared/enums';
import {ICardGroup} from '../../../../shared/interfaces/card-group.interface';
import {ApiCardGroupService} from '../../../../app/api-card-groups.service';

@Component({
  selector: 'app-edit-card-group-modal',
  templateUrl: './edit-card-group-modal.component.html',
  styleUrls: ['./edit-card-group-modal.component.scss'],
})
export class EditCardGroupModalComponent implements OnInit {
  loading = false;
  message: string;
  messageType: string;
  errorMessages: {[key: string]: string};

  form: AppFormGroup;

  mode: EditMode;

  mccFilterModel = '';
  merchants: any[] = [];
  cardGroupId: string;

  types: any[] = this.getTypeList();
  data: any;
  constructor(
    private dialogRef: MatDialogRef<EditCardGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: EditCardGroupModalData,
    private readonly apiMerchantsService: ApiMerchantsService,
    fb: AppFormBuilder,
    private readonly apiCardGroupsService: ApiCardGroupService,
  ) {
    this.mode = data.mode;
    this.data = data;
    this.initForm(fb, data.cardGroupData);
  }

  ngOnInit() {
    if (this.mode === EditMode.EDIT) {
      this.form.controls['name'].disable();
      this.apiMerchantsService
        .indexMerchants(0, 1, {name: this.data.cardGroupData.merchantId})
        .subscribe((value) => {
          this.merchants = value.items;
        });
    } else {
      this.apiMerchantsService.indexMerchants(0, 25).subscribe((value) => {
        this.merchants = value.items;
      });
    }
  }

  initForm(fb: AppFormBuilder, data?: ICardGroup) {
    this.form = fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]],
      description: ['', [Validators.pattern('^[A-Za-z0-9 ]+$')]],
      cardType: ['', [Validators.required]],
      merchantId: [''],
      mccFilterCtrl: [''],
    });
    if (data) {
      this.cardGroupId = data.id;
      this.form.patchValue(data);
    }
    this.errorMessages = AppValidators.initErrorMessageObject(this.form);
  }

  onSubmit() {
    this.form.markAllAsDirty();
    this.errorMessages = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }
    const cardGroupData = this.getCardGroupUpdateModel();

    this.loading = true;
    this.message = this.messageType = '';
    this.apiCardGroupsService.createOrUpdateCardGroup(cardGroupData).subscribe(
      () => {
        this.loading = false;
        this.dialogRef.close('success');
      },
      (err) => {
        this.loading = false;
        this.messageType = 'error';
        if (err.error) {
          const errorResponse = err.error;
          if (errorResponse.errors) {
            this.message = this.formatValidationErrors(errorResponse.errors);
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

  onSearchMerchant() {
    if (this.mode === EditMode.ADD) {
      this.apiMerchantsService
        .indexMerchants(0, 25, this.mccFilterModel ? {name: this.mccFilterModel} : null)
        .subscribe((value) => {
          this.merchants = value.items;
          if (
            !value.items
              .map((item) => item.merchantId)
              .includes(this.form.controls['merchantId'].value)
          ) {
            this.form.controls['merchantId'].setValue('');
          }
        });
    }
  }

  private getTypeList(): any[] {
    return convertEnumToObject(Types, true);
  }

  private formatValidationErrors(errors: any): string {
    const errorMessages = new MessageBag(errors).all();
    return `Validation failed: ${errorMessages[0]}`;
  }

  private getCardGroupUpdateModel(): ICardGroup {
    const formValue = this.form.value;
    if (this.mode === EditMode.EDIT) {
      return {
        id: this.cardGroupId,
        ...(formValue.description
          ? {description: formValue.description.trim()}
          : {description: ''}),
        ...(this.form.controls['merchantId'].value
          ? {merchantId: this.form.controls['merchantId'].value.trim()}
          : {merchantId: ''}),
      } as ICardGroup;
    } else {
      return {
        id: this.cardGroupId,
        ...(formValue.name && {name: formValue.name.trim()}),
        ...(formValue.description && {description: formValue.description.trim()}),
        // level: formValue.level,
        level: formValue.merchantId ? Levels.MERCHANT : Levels.ENTERPRISE,
        cardType: formValue.cardType,
        ...(formValue.merchantId && {merchantId: formValue.merchantId.trim()}),
      } as ICardGroup;
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
}
