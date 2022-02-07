import {Component, Input, ViewChild} from '@angular/core';
import {FormArray, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as L from 'lodash';
import {Subject, iif, of} from 'rxjs';
import {takeUntil, switchMap} from 'rxjs/operators';

import {NotificationService} from 'src/app/notification.service';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {PermissionDeniedError} from '../../../../shared/helpers/permissionDenied.error';
import {
  IUpdateVouchersBatchInput,
  VoucherBatchGenerationType,
  VoucherRedeemType,
} from '../../../../shared/interfaces/vouchers.interface';
import {ApiVouchersService} from '../../../api-vouchers.service';
import {AppEmitter} from '../../../emitter.service';
import {parseCodesFile} from '../../parseCodesFile';
import {IDropdownItem} from '../../../../shared/components/dropdown/dropdown.interface';
import {
  DateTimeAdapter,
  MomentDateTimeAdapter,
  OWL_DATE_TIME_LOCALE,
} from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'app-vouchers-batch-edit',
  templateUrl: './vouchersBatchEdit.html',
  styleUrls: ['./vouchersBatchEdit.scss'],
  providers: [
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  ],
})
export class VouchersBatchEditComponent {
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

  batchId;
  loaded = false;
  form: AppFormGroup;
  rulesCount = 1;
  errorMessage;
  voucherRedeemExpiryType = [];

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

  @ViewChild('fileUpload', {static: false}) fileUpload;

  getNewRuleGroup(rule: any = {}) {
    const fb = new AppFormBuilder();
    const expiryDate = rule.expiryDate ? new Date(rule.expiryDate) : '';
    return fb.group({
      _id: [rule._id],
      batchId: [rule.batchId],
      name: [rule.name || '', [Validators.required]],
      amount: [rule.amount || '', [Validators.required, Validators.min(0.1)]],
      expiryDate: [expiryDate, [AppValidators.greaterThanNowDate]],
      daysToExpire: [rule.daysToExpire || '', [Validators.min(1)]],
      tag: [rule.tag || '', [Validators.required]],
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
      this.batchId = param.batchId;
      this.initFields();
    });
  }

  formValidation() {
    this.apiVouchersService.validationForm.emit('Validation event');
  }

  changeVoucherExpiryType() {
    this.form.controls.redeemExpiry.reset();
  }

  private initFields(loader = 'full'): void {
    this.loading[loader] = true;
    this.apiVouchersService
      .getBatchById(this.batchId)
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
    const startDate = batch.startDate ? new Date(batch.startDate) : '';
    const expiryDate = batch.expiryDate ? new Date(batch.expiryDate) : '';
    const redeemExpiryDate = L.get(batch, 'redeemExpiry.date');
    this.form = this.fb.group(
      {
        name: [batch.name || '', [Validators.required]],
        startDate: [startDate, [Validators.required]],
        expiryDate: [expiryDate, [AppValidators.greaterThanNowDate]],
        generationType: [batch.generationType],
        displayAs: [this.displayAsOpts.find(({value}) => value === batch.displayAs)],
        codes: this.fb.array([]),
        description: [batch.description || ''],
        termContent: [batch.termContent || ''],
        termsUrl: [batch.termsUrl || '', [AppValidators.validUrl]],
        bannerUrl: [batch.bannerUrl || '', [AppValidators.validUrl]],
        iconUrl: [batch.iconUrl || '', [AppValidators.validUrl]],
        ...(batch.redeemType !== VoucherRedeemType.EXTERNAL && {
          rules: this.fb.array(batch.rules.map((rule) => this.getNewRuleGroup(rule))),
        }),
        redeemExpiry: this.fb.group({
          days: [L.get(batch, 'redeemExpiry.days'), [Validators.min(1)]],
          date: [redeemExpiryDate ? new Date(redeemExpiryDate) : ''],
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
    this.rulesCount = batch.rules.length;
    if (L.get(batch, 'redeemExpiry.date')) {
      this.voucherRedeemExpiryType = [true];
    }
  }

  private formatFormData(formData): IUpdateVouchersBatchInput {
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
      ...(formData.displayAs && {
        displayAs: formData.displayAs.value,
      }),
      startDate: formData.startDate,
      rules: [],
      ...((formData.redeemExpiry.days || formData.redeemExpiry.date) && {
        redeemExpiry: formData.redeemExpiry.date
          ? {date: formData.redeemExpiry.date}
          : {days: +formData.redeemExpiry.days},
      }),
      ...(formData.expiryDate && {expiryDate: formData.expiryDate}),
      ...(formData.description && {description: formData.description}),
      ...(formData.termContent && {termContent: formData.termContent}),
      ...(formData.termsUrl && {termsUrl: formData.termsUrl}),
      ...(formData.bannerUrl && {bannerUrl: formData.bannerUrl}),
      ...(formData.iconUrl && {iconUrl: formData.iconUrl}),
    };

    (formData.rules || []).forEach((item) => {
      const ruleItem = {
        _id: item._id,
        batchId: item.batchId,
        name: item.name,
        amount: Number(item.amount),
        expiryDate: item.expiryDate || null,
        daysToExpire: Number(item.daysToExpire) || null,
        tag: item.tag,
        type: item.type.value,
      };
      resultData.rules.push(ruleItem);
    });

    return resultData;
  }

  updateBatch() {
    this.formValidation();
    this.form.markAllAsDirty();
    this.errorMessage = AppValidators.getErrorMessageObject(this.form);
    if (this.form.invalid) {
      return;
    }
    const formValues = this.form.value;
    const formatData = this.formatFormData(formValues);
    this.apiVouchersService
      .updateVouchersBatch(this.batchId, formatData)
      .pipe(
        switchMap(() =>
          iif(
            () => !!this.form.get('codes').value.length,
            this.apiVouchersService.uploadVouchersCodes(this.batchId, this.form.get('codes').value),
            of(1),
          ),
        ),
      )
      .subscribe(
        () => {
          this.notificationService.showMessage({
            title: 'Vouchers batch was updated',
            variant: 'success',
          });
          this.router.navigate(['/gifts/voucher-batches']);
        },
        ({error}) => {
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

  isUploadVisible() {
    return this.form.value.generationType === VoucherBatchGenerationType.UPLOAD;
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
