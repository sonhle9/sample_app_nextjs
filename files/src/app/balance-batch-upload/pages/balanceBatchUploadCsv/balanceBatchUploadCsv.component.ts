import {Component, OnDestroy} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {pipe, Subject, interval} from 'rxjs';
import {filter, map, tap, takeUntil, take, mergeMap} from 'rxjs/operators';
import {HttpEventType, HttpEvent, HttpResponse} from '@angular/common/http';

import {requiredFileType} from '../../../../shared/components/file-upload/validators/requireFileType.validator';
import {ICsvFileResponse} from '../../../../shared/interfaces/balanceBatchUpload.interface';
import {bulkGrantWalletBalanceRole} from 'src/shared/helpers/roles.type';
import {getRolePermissions} from '../../../../shared/helpers/common';
import {AuthService} from '../../../auth.service';
import {ApiPaymentsService} from '../../../api-payments.service';
import {environment} from '../../../../environments/environment';

export function toResponseBody<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body),
  );
}

export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

@Component({
  selector: 'app-balance-batch-upload-csv',
  templateUrl: './balanceBatchUploadCsv.component.html',
  styleUrls: ['./balanceBatchUploadCsv.component.scss'],
})
export class BalanceBatchUploadCsvComponent implements OnDestroy {
  apiBaseUrl = '/api/ops';
  apiPaymentsUrl = `${environment.paymentsApiBaseUrl}/api/payments`;
  progress = 0;
  messageContent: string;
  messageType: string;
  isFileSelected = false;
  isFileCheked = false;
  isConfirmModalShow = false;
  csvModel: Array<ICsvFileResponse>;
  loading = false;
  allSub: Subject<any> = new Subject<any>();
  grantCSV = new FormGroup({
    csvFile: new FormControl(null, [Validators.required, requiredFileType('csv')]),
  });

  constructor(protected authService: AuthService, private paymentsService: ApiPaymentsService) {}

  getRolePermissions() {
    return getRolePermissions(this.authService, bulkGrantWalletBalanceRole);
  }

  checkCSV() {
    if (
      this.grantCSV.get('csvFile').errors !== null &&
      this.grantCSV.get('csvFile').errors.requiredFileType
    ) {
      this.messageContent = 'File can be only csv format';
      this.messageType = 'error';
      this.grantCSV.reset();
      return;
    }
    this.paymentsService
      .parseBatchGrantBalanceCsv(this.grantCSV.value)
      .pipe(
        uploadProgress((progress) => (this.progress = progress)),
        toResponseBody(),
      )
      .subscribe(
        (response: Array<ICsvFileResponse>) => {
          this.csvModel = response;
          this.progress = 0;
          this.isFileCheked = true;
          this.messageType = 'success';
          this.messageContent = 'File proccessed successfuly!';
        },
        (failureResponse) => {
          this.progress = 0;
          this.isFileCheked = false;
          this.grantCSV.reset();
          this.messageContent = failureResponse.error.message;
          this.messageType = 'error';
        },
      );
  }

  hasPermissions() {
    const permissions: any = this.getRolePermissions();

    if (!permissions.hasAdd) {
      return false;
    }
    return true;
  }

  isConfirmBtnDisabled(): boolean {
    return !this.isFileCheked;
  }

  isLoadCsvButtonDisabled(): boolean {
    return this.grantCSV.get('csvFile').value === null;
  }

  confirmModalOpen(): void {
    this.isConfirmModalShow = true;
  }

  getConfirmModalState(): boolean {
    return this.isConfirmModalShow;
  }

  confirmSubmit(): void {
    this.isConfirmModalShow = false;
    const batchName = this.grantCSV.get('csvFile').value.name;
    this.loading = true;
    this.paymentsService
      .batchGrantBalance({items: this.csvModel, batchName})
      .pipe(toResponseBody())
      .subscribe(
        (res: any) => {
          this.checkUploadProgress(res.id, res.data.length);
        },
        (failureResponse) => {
          this.loading = false;
          this.messageContent =
            (failureResponse.error.errors &&
              failureResponse.error.errors.userId &&
              failureResponse.error.errors.userId[0]) ||
            failureResponse.error.message;
          this.messageType = 'error';
        },
      );
  }

  checkUploadProgress(batchId: string, batchItemsCount: number) {
    const checkDelay = 1000;
    const checkAttempts = 60;

    const subscription = interval(checkDelay)
      .pipe(take(checkAttempts))
      .pipe(
        mergeMap(async (idx) => {
          if (idx === checkAttempts - 1) {
            this.messageType = 'error';
            this.messageContent = 'Timeout error';
            this.loading = false;
            subscription.unsubscribe();
          }

          this.paymentsService
            .getBatchGrantBalanceProcessed(batchId)
            .pipe(takeUntil(this.allSub))
            .subscribe(
              (res: any) => {
                if (res.body.processed === batchItemsCount) {
                  this.messageType = 'success';
                  this.messageContent = 'File upload successfuly!';
                  this.loading = false;
                  subscription.unsubscribe();
                }
              },
              (err) => {
                this.messageContent = err.message;
                this.messageType = 'error';
                this.loading = false;
                subscription.unsubscribe();
              },
            );
        }),
      )
      .subscribe();
  }

  confirmCancel(): void {
    this.isConfirmModalShow = false;
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }
}
