import {Component, Input, ViewChild} from '@angular/core';
import {FormArray, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  DateTimeAdapter,
  MomentDateTimeAdapter,
  OWL_DATE_TIME_LOCALE,
} from '@danielmoncada/angular-datetime-picker';
import * as L from 'lodash';
import moment from 'moment';
import {defer, Subject, of} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {NotificationService} from 'src/app/notification.service';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {PermissionDeniedError} from '../../../../shared/helpers/permissionDenied.error';
import {
  IBaseVouchersBatch,
  VoucherBatchGenerationType,
  VoucherRedeemType,
} from '../../../../shared/interfaces/vouchers.interface';
import {ApiVouchersService} from '../../../api-vouchers.service';
import {AppEmitter} from '../../../emitter.service';
import {parseCodesFile} from '../../parseCodesFile';

@Component({
  selector: 'app-vouchers-batch-create',
  templateUrl: './vouchersBatchCreate.html',
  styleUrls: ['./vouchersBatchCreate.scss'],
  providers: [
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  ],
})
export class VouchersBatchCreateComponent {
  @ViewChild('fileUpload', {static: false}) fileUpload;
  @Input()
  loading = {
    full: false,
    page: false,
    get any() {
      return this.full || this.page;
    },
    stop() {
      this.full = this.page = false;
    },
  };

  loaded = false;
  form: AppFormGroup;
  rulesCount = 1;
  batchLinkingExpiryType = [true];
  voucherRedeemExpiryType = [true];
  errorMessage;
  redeemTypesEnum: IDropdownItem<VoucherRedeemType>[] = [
    {
      text: 'Topup',
      value: VoucherRedeemType.TOPUP,
    },
    {
      text: 'Registration',
      value: VoucherRedeemType.REGISTRATION,
    },
    {
      text: 'Fuel',
      value: VoucherRedeemType.FUEL,
    },
  ];

  generationTypesEnum: IDropdownItem<VoucherBatchGenerationType>[] = [
    {
      text: 'On-demand',
      value: VoucherBatchGenerationType.ON_DEMAND,
    },
    {
      text: 'Instant',
      value: VoucherBatchGenerationType.INSTANT,
    },
    {
      text: 'Upload',
      value: VoucherBatchGenerationType.UPLOAD,
    },
  ];

  displayAsOpts: IDropdownItem<string>[] = [
    {
      text: 'Text',
      value: 'text',
    },
    {
      text: 'Text & Barcode',
      value: 'barcode_and_text',
    },
  ];

  allSub: Subject<any> = new Subject<any>();

  getNewRuleGroup(rule: any = {}) {
    const fb = new AppFormBuilder();
    const expiryDate = rule.expiryDate ? new Date(rule.expiryDate) : '';
    return fb.group({
      name: [rule.name || '', [Validators.required]],
      amount: [rule.amount || '', [Validators.required, Validators.min(0.1)]],
      expiryDate: [expiryDate, [AppValidators.greaterThanNowDate]],
      daysToExpire: [rule.daysToExpire || '', [Validators.min(1)]],
      tag: [
        rule.tag || '',
        {validators: [Validators.required, AppValidators.tagValidatorForInput]},
      ],
      type: [rule.type || '', [Validators.required]],
    });
  }

  constructor(
    route: ActivatedRoute,
    private fb: AppFormBuilder,
    private apiVouchersService: ApiVouchersService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      if (param.batchId) {
        this.initFields(param.batchId);
      } else {
        this.initForm();
      }
    });
  }

  formValidation() {
    this.apiVouchersService.validationForm.emit('Validation event');
  }

  private initFields(id: string, loader = 'full'): void {
    this.loading[loader] = true;
    this.apiVouchersService
      .getBatchById(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.initForm(res);
          this.loading.stop();
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  private initForm(batch: any = {rules: [{}]}) {
    const redeemType = this.redeemTypesEnum.find((item) => item.value === batch.redeemType);
    const generationType = this.generationTypesEnum.find(
      (item) => item.value === batch.generationType,
    );
    const rules = batch.rules.map((rule) => this.getNewRuleGroup(rule));
    const startDate = batch.startDate ? new Date(batch.startDate) : '';
    const expiryDate = batch.expiryDate ? new Date(batch.expiryDate) : '';
    const redeemExpiryDate = L.get(batch, 'redeemExpiry.date');
    this.form = this.fb.group(
      {
        name: [batch.name || '', [Validators.required]],
        generationType: [generationType || '', [Validators.required]],
        startDate: [startDate, [Validators.required, AppValidators.greaterThanNowDate]],
        vouchersCount: [
          batch.vouchersCount || '',
          [Validators.required, Validators.min(0), Validators.max(50000)],
        ],
        expiryDate: [expiryDate, [AppValidators.greaterThanNowDate]],
        daysToExpire: [batch.daysToExpire || '', [Validators.min(1)]],
        redeemType: [redeemType || '', [Validators.required]],
        description: [batch.description],
        termContent: [batch.termContent],
        termsUrl: [batch.termsUrl, [AppValidators.validUrl]],
        bannerUrl: [batch.bannerUrl, [AppValidators.validUrl]],
        iconUrl: [batch.iconUrl, [AppValidators.validUrl]],
        prefix: [batch.prefix],
        postfix: [batch.postfix],
        rules: this.fb.array([...rules]),
        redeemExpiry: this.fb.group({
          days: [L.get(batch, 'redeemExpiry.days'), [Validators.min(1)]],
          date: [
            redeemExpiryDate ? new Date(redeemExpiryDate) : '',
            [AppValidators.greaterThanNowDate],
          ],
        }),
      },
      {
        validator: (form) => {
          AppValidators.greaterThanDate(form.controls.expiryDate, form.controls.startDate);
          AppValidators.greaterThanDate(
            form.controls.redeemExpiry.controls.date,
            form.controls.startDate,
          );
        },
      },
    );
    this.errorMessage = AppValidators.initErrorMessageObject(this.form);
    this.loaded = true;
    this.rulesCount = rules.length;
  }

  private formatFormData(formData): IBaseVouchersBatch {
    if (formData.daysToExpire) {
      formData.expiryDate = moment(formData.startDate).add(Number(formData.daysToExpire), 'd');
    }

    if (formData.generationType.value === VoucherBatchGenerationType.ON_DEMAND) {
      formData.vouchersCount = 0;
    }

    const resultData = {
      name: formData.name,
      content: {
        title: {
          en: formData.name,
        },
        ...(formData.description && {
          description: {
            en: formData.description,
          },
        }),
      },
      startDate: formData.startDate,
      vouchersCount: Number(formData.vouchersCount),
      redeemType: formData.redeemType.value,
      generationType: formData.generationType.value,
      rules: [],
      ...((formData.redeemExpiry.days || formData.redeemExpiry.date) && {
        redeemExpiry: formData.redeemExpiry.date
          ? {date: formData.redeemExpiry.date}
          : {days: +formData.redeemExpiry.days},
      }),
      ...(formData.description && {description: formData.description}),
      ...(formData.termContent && {termContent: formData.termContent}),
      ...(formData.termsUrl && {termsUrl: formData.termsUrl}),
      ...(formData.bannerUrl && {bannerUrl: formData.bannerUrl}),
      ...(formData.iconUrl && {iconUrl: formData.iconUrl}),
      ...(formData.prefix && {prefix: formData.prefix}),
      ...(formData.postfix && {postfix: formData.postfix}),
      ...(formData.expiryDate && {expiryDate: formData.expiryDate}),
    };

    (formData.rules || []).forEach((item) => {
      const ruleItem = {
        name: item.name,
        amount: Number(item.amount),
        ...(item.expiryDate && {expiryDate: item.expiryDate}),
        ...(item.daysToExpire && {daysToExpire: Number(item.daysToExpire)}),
        tag: item.tag,
        type: item.type.value,
      };
      resultData.rules.push(ruleItem);
    });

    return resultData;
  }

  saveBatch() {
    this.formValidation();
    this.form.markAllAsDirty();
    const formValues = this.form.value;
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);
    if (this.form.invalid) {
      return;
    }
    const formatData = this.formatFormData(formValues);
    this.apiVouchersService
      .createVouchersBatch(formatData)
      .pipe(
        switchMap((batch) =>
          defer(() =>
            !!this.form.get('codes')
              ? this.apiVouchersService.uploadVouchersCodes(batch._id, this.form.get('codes').value)
              : of(1),
          ),
        ),
      )
      .subscribe(
        () => {
          this.notificationService.showMessage({
            title: 'Vouchers batch was created',
            variant: 'success',
          });
          this.router.navigate(['/gifts/voucher-batches']);
        },
        (error) => {
          this.notificationService.showMessage({title: error.message, variant: 'error'});
        },
      );
  }

  resetForm() {
    this.form.reset();
    this.errorMessage = [];
    this.apiVouchersService.resetForm.emit('Reset event');
  }

  addRule() {
    const rulesArrayControl = this.form.controls['rules'] as FormArray;
    rulesArrayControl.push(this.getNewRuleGroup());
    this.rulesCount++;
  }

  removeRule(index: number) {
    const rulesArrayControl = this.form.controls['rules'] as FormArray;
    rulesArrayControl.removeAt(index);
    this.rulesCount--;
  }

  getRulesCount(): number {
    const rules = this.form.controls.rules as FormArray;
    return rules.controls.length;
  }

  changeLinkingBatchExpiryType() {
    this.form.controls.expiryDate.reset();
    delete this.errorMessage.expiryDate;
    this.form.controls.daysToExpire.reset();
    delete this.errorMessage.daysToExpire;
  }

  changeVoucherExpiryType() {
    this.form.controls.redeemExpiry.reset();
  }

  isVouchersCountVisible() {
    return (
      this.form.value.generationType &&
      this.form.value.generationType.value === VoucherBatchGenerationType.INSTANT
    );
  }

  isUploadVisible() {
    return (
      this.form.value.generationType &&
      this.form.value.generationType.value === VoucherBatchGenerationType.UPLOAD
    );
  }

  changedRedeemType() {
    return this.form.addControl('rules', this.fb.array([this.getNewRuleGroup()]));
  }

  changedGenType() {
    const {value: generationType} = this.form.get('generationType');
    if (
      [VoucherBatchGenerationType.ON_DEMAND, VoucherBatchGenerationType.UPLOAD].includes(
        generationType.value,
      )
    ) {
      this.form.get('vouchersCount').setValue(0);
    }

    if (generationType === VoucherBatchGenerationType.UPLOAD) {
      this.form.addControl('codes', this.fb.array([], AppValidators.arrayMinLength(1)));
    } else {
      this.clearCodesFileInput();
    }
  }

  uploadCodes(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      try {
        this.form.setControl(
          'codes',
          this.fb.array(parseCodesFile(reader.result), AppValidators.arrayMinLength(1)),
        );
      } catch (errors) {
        this.notificationService.showMessage({
          title: errors,
          variant: 'error',
        });
        this.clearCodesFileInput();
      }
    };
    reader.onerror = () => {
      reader.abort();
      this.notificationService.showMessage({
        title: reader.error.message,
        variant: 'error',
      });
      this.clearCodesFileInput();
    };
  }

  clearCodesFileInput() {
    this.fileUpload.nativeElement.value = '';
    this.form.removeControl('codes');
  }
}
