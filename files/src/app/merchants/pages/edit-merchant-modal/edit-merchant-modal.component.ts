import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  IMerchantType,
  IMerchantUpdateModel,
} from '../../../../shared/interfaces/merchant.interface';
import {EditMerchantModalData} from '../../shared/models';
import {EditMode} from '../../shared/enums';
import {
  MerchantTypeCodes,
  SettlementScheduleDelayDayType,
  SettlementScheduleInterval,
} from '../../../../shared/enums/merchant.enum';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {Validators} from '@angular/forms';
import {MessageBag} from '../../shared/validation';
import {Country, getAllCountries, getAllTimezones, Timezone} from 'countries-and-timezones';
import * as _ from 'lodash';
import {CombinedMerchantCategoryCodes} from '../../shared/constants';
import {Subject} from 'rxjs';
import {ProductOfferings} from 'src/react/modules/merchants/merchants.type';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {ApiCustomFieldRulesService} from '../../../api-custom-field-rules.service';
import {ICustomFieldRule} from '../../../../react/modules/custom-field-rules/custom-field-rules.type';
import {pairwise, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-edit-merchant-modal',
  templateUrl: './edit-merchant-modal.component.html',
  styleUrls: ['./edit-merchant-modal.component.scss'],
})
export class EditMerchantModalComponent implements OnInit {
  loading = false;
  message: string;
  messageType: string;
  errorMessages: {[key: string]: string};

  submitErrorMessages: string[] = [];

  allSub: Subject<any> = new Subject<any>();

  form: AppFormGroup;

  mode: EditMode;
  merchantId: string;
  prevMerchantId: string;

  countryList: Country[] = this.getCountryList();
  timezoneList: Timezone[] = this.getTimezoneList();
  typeList: IMerchantType[];
  customFieldList: ICustomFieldRule[];
  customFieldErrors: {[key: string]: boolean} = {};
  delayDayTypeList: SettlementScheduleDelayDayType[] = Object.values(
    SettlementScheduleDelayDayType,
  );
  intervalList: SettlementScheduleInterval[] = Object.values(SettlementScheduleInterval);

  merchantCategoryCodes = CombinedMerchantCategoryCodes;

  mccFilterModel = '';
  countryFilterModel = '';
  timezoneFilterModel = '';
  typeFilterModel = '';
  productOfferings: ProductOfferings;

  showAdvancedOptions = false;

  disableMerchantId: boolean;

  constructor(
    private dialogRef: MatDialogRef<EditMerchantModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: EditMerchantModalData,
    private readonly apiMerchantsService: ApiMerchantsService,
    private readonly apiCustomFieldRulesService: ApiCustomFieldRulesService,
    fb: AppFormBuilder,
  ) {
    this.mode = data.mode;
    this.merchantId = data.merchantId || undefined;
    this.disableMerchantId = false;
    this.initForm(fb, data.merchantData);
  }

  ngOnInit() {
    this.initMerchantTypes();

    this.form
      .get('type')
      .valueChanges.pipe(startWith(null), pairwise())
      .subscribe(([prev]: [any, any]) => {
        const prevTypeCode = prev ? this.typeList.find((type) => type.id === prev).code : '';

        if (prevTypeCode !== MerchantTypeCodes.GIFT_CARD_CLIENT) {
          this.prevMerchantId = this.form.value.merchantId;
        }
      });
  }

  initMerchantTypes() {
    this.apiMerchantsService.indexMerchantTypes().subscribe((value) => {
      this.typeList = value;
    });
  }

  initForm(fb: AppFormBuilder, data?: IMerchantUpdateModel) {
    this.form = fb.group({
      ...(this.hasMerchantIdInput() ? {merchantId: ['']} : null),
      name: ['', [Validators.required]],
      legalName: ['', [Validators.required]],
      type: [''],
      countryCode: ['MY', [Validators.required]],
      timezone: ['Asia/Kuala_Lumpur', [Validators.required]],
      paymentsEnabled: [true],
      settlementsEnabled: [false],
      payoutEnabled: [true],
      delayDays: [0, [AppValidators.integerOnly, Validators.min(0)]],
      delayDayType: [SettlementScheduleDelayDayType.calendar, Validators.required],
      interval: [SettlementScheduleInterval.daily, Validators.required],
      merchantCategoryCode: [null, Validators.required],
      mccFilterCtrl: [''],
      countryFilterCtrl: [''],
      timezoneFilterCtrl: [''],
      typeFilterCtrl: [''],
    });
    if (data) {
      this.form.patchValue(data);
    }
    this.errorMessages = AppValidators.initErrorMessageObject(this.form);
  }

  hasMerchantIdInput(): boolean {
    return CURRENT_ENTERPRISE.name === 'pdb';
  }

  onSubmit() {
    this.form.markAllAsDirty();
    this.errorMessages = AppValidators.getErrorMessageObject(this.form);

    if (this.form.invalid) {
      return;
    }

    // @ts-ignore
    for (const [key, value] of Object.entries(this.customFieldErrors)) {
      if (value) {
        return;
      }
    }

    const merchantData = this.getMerchantUpdateModel();
    this.loading = true;
    this.message = this.messageType = '';
    this.submitErrorMessages = [];
    let createMerchantPayload = {...merchantData};
    if (this.customFieldList && this.customFieldList.length > 0) {
      createMerchantPayload = {...createMerchantPayload, customFields: this.customFieldList};
    }
    this.apiMerchantsService.createMerchant(createMerchantPayload).subscribe(
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

  onMerchantTypeChange() {
    const merchantTypeId = this.form.value.type;
    const merchantTypeCode = this.typeList.find((type) => type.id === merchantTypeId).code;
    if (this.hasMerchantIdInput() && merchantTypeCode === MerchantTypeCodes.GIFT_CARD_CLIENT) {
      this.disableMerchantId = true;
      this.form.patchValue({
        merchantId: '',
      });
    } else {
      this.disableMerchantId = false;
      this.form.patchValue({
        merchantId: this.prevMerchantId,
      });
    }
    this.apiCustomFieldRulesService
      .getCustomFieldByMerchantType(merchantTypeId)
      .subscribe((value: ICustomFieldRule[]) => {
        this.customFieldList = value;
      });
  }

  onCustomFieldChange(field: {name: string; value: string | string[]}) {
    const index = this.customFieldList.findIndex((f) => f.fieldName === field.name);
    if (index >= 0) {
      this.customFieldList[index].value = field.value;
      const validations = this.customFieldList[index].validations;
      if (validations && validations.length > 0 && validations.includes('alpha_numeric')) {
        this.customFieldErrors[field.name] = !/^[a-z0-9]*$/i.test(field.value.toString());
      } else if (validations && validations.length > 0 && validations.includes('only_numeric')) {
        this.customFieldErrors[field.name] = !/^[0-9]*$/i.test(field.value.toString());
      }
    }
  }

  isFieldError(fieldName: string) {
    return !!this.customFieldErrors[fieldName];
  }

  private getCountryList(): Country[] {
    return _.sortBy(_.values(getAllCountries()), ['name']);
  }

  private getTimezoneList(): Timezone[] {
    return _.sortBy(
      _.reject(_.values(getAllTimezones()), (timezone) => timezone.name.startsWith('Etc')),
      ['utcOffset', 'name'],
    );
  }

  private formatValidationErrors(errors: any): string {
    const errorMessages = new MessageBag(errors).all();
    return `Validation failed: ${errorMessages[0]}`;
  }

  private getMerchantUpdateModel(): IMerchantUpdateModel {
    const formValue = this.form.value;
    const typeId = formValue.type ? formValue.type : undefined;
    const merchantId = formValue.merchantId ? formValue.merchantId.toString() : undefined;
    const merchant = {
      merchantId,
      name: formValue.name,
      legalName: formValue.legalName,
      typeId,
      countryCode: formValue.countryCode,
      timezone: formValue.timezone,
      paymentsEnabled: formValue.paymentsEnabled,
      settlementsEnabled: formValue.settlementsEnabled,
      payoutEnabled: formValue.payoutEnabled,
      settlementsSchedule: {
        delayDays: formValue.delayDays,
        delayDayType: formValue.delayDayType,
        interval: formValue.interval,
      },
      userIds: [],
      merchantCategoryCode: formValue.merchantCategoryCode,
    };

    if (typeId) {
      const merchantType = this.typeList.find((item) => item.id === typeId);
      this.productOfferings = merchantType.products;
      merchant['productOfferings'] = this.productOfferings;
    }

    return merchant;
  }
}
