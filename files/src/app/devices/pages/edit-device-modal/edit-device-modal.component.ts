import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EditMode, DevicesStatus} from '../../shared/enums';
import {AppFormBuilder, AppFormGroup, AppValidators} from '../../../../shared/helpers/formGroup';
import {Validators} from '@angular/forms';
import {EditDeviceModalData} from '../../shared/models';
import {IDeviceUpdateModel} from '../../shared/device.interface';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {MessageBag} from '../../shared/validation';
import {IMerchant, IDevice} from '../../../../shared/interfaces/merchant.interface';
@Component({
  selector: 'app-edit-device-modal',
  templateUrl: './edit-device-modal.component.html',
  styleUrls: ['./edit-device-modal.component.scss'],
})
export class EditDeviceModalComponent implements OnInit {
  loading = false;
  message: string;
  messageType: string;
  errorMessages: {[key: string]: string};

  merchants: IMerchant[] = [];

  submitErrorMessages: string[] = [];

  form: AppFormGroup;

  EditMode = EditMode;

  DeviceStatus = Object.keys(DevicesStatus);

  mode: EditMode;
  deviceId: string;

  deviceData: IDevice;

  constructor(
    private dialogRef: MatDialogRef<EditDeviceModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: EditDeviceModalData,
    private readonly apiMerchantsService: ApiMerchantsService,
    fb: AppFormBuilder,
  ) {
    this.mode = data.mode;
    this.deviceData = data.deviceData || null;
    this.deviceId = (data.deviceData && data.deviceData.id) || undefined;
    this.initForm(fb, data.deviceData);
  }

  ngOnInit() {
    this._initMerchants();
  }

  private _initMerchants() {
    let merchantIds: string;
    if (this.deviceData && this.deviceData.merchantMerchantIds.length) {
      merchantIds = this.deviceData.merchantMerchantIds.join(',');
    }

    this.apiMerchantsService
      .indexMerchants(
        1,
        25,
        merchantIds
          ? {
              merchantIds,
            }
          : null,
      )
      .subscribe(
        (value) => {
          this.merchants = value.items;
          if (this.deviceData) {
            this.form.patchValue({
              merchantMerchantIds: this.deviceData.merchantMerchantIds,
            });
          }
        },
        (error) => {
          console.log(error);
          this.merchants = [];
        },
      );
  }

  // !important: filter item when input
  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return !!item;
  }

  onSearch($event) {
    let searchValue;
    if ($event && $event.term) {
      searchValue = $event.term;
    } else {
      searchValue = null;
    }
    this.apiMerchantsService
      .indexMerchants(
        1,
        25,
        searchValue
          ? {
              searchValue,
            }
          : null,
      )
      .subscribe(
        (value) => {
          this.merchants = value.items;
        },
        (error) => {
          console.log(error);
          this.merchants = [];
        },
      );
  }

  initForm(fb: AppFormBuilder, data?: IDeviceUpdateModel) {
    this.form = fb.group({
      serialNo: ['', [Validators.required]],
      modelDevice: ['', [Validators.required]],
      status: [data && data.status ? data.status : DevicesStatus.OFFLINE, [Validators.required]],
      merchantMerchantIds: [[]],
    });
    if (data) {
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
    const deviceData = this.getDeviceUpdateModel();

    this.loading = true;
    this.message = this.messageType = '';
    this.submitErrorMessages = [];

    if (this.mode === EditMode.ADD) {
      this.createDevice(deviceData);
    } else if (this.mode === EditMode.EDIT) {
      this.editDevice(deviceData);
    }
  }

  editDevice(deviceData: Partial<IDevice>) {
    this.apiMerchantsService.updateDevice(this.deviceId, deviceData).subscribe(
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

  createDevice(deviceData: Partial<IDevice>) {
    this.apiMerchantsService.createDevice(deviceData).subscribe(
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

  private formatValidationErrors(errors: any): string {
    const errorMessages = new MessageBag(errors).all();
    return `Validation failed: ${errorMessages[0]}`;
  }

  private getDeviceUpdateModel(): IDeviceUpdateModel {
    const formValue = this.form.value;
    return {
      serialNo: formValue.serialNo,
      modelDevice: formValue.modelDevice,
      status: formValue.status,
      merchantMerchantIds: formValue.merchantMerchantIds,
    };
  }
}
