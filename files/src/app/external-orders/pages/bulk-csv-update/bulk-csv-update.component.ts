import {Component, OnInit, OnDestroy, Input, ElementRef, ViewChild} from '@angular/core';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {getRolePermissions, downloadFile} from '../../../../shared/helpers/common';
import {AuthService} from '../../../auth.service';
import {environment} from 'src/environments/environment';
import {Subject, pipe} from 'rxjs';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {requiredFileType} from 'src/shared/components/file-upload/validators/requireFileType.validator';
import {
  ICsvFileOrderResponse,
  ICsvPreviewOrdersResponse,
  IExternalOrderRole,
} from 'src/shared/interfaces/externalOrder.interface';
import {ApiExternalOrderService} from 'src/app/api-external-orders.service';
import {HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {filter, map, tap} from 'rxjs/operators';
import {BulkCsvPreviewComponent} from '../bulk-csv-preview/bulk-csv-preview.component';

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
  selector: 'app-bulk-csv-update',
  templateUrl: './bulk-csv-update.component.html',
  styleUrls: ['./bulk-csv-update.component.scss'],
})
export class BulkCsvUpdateComponent implements OnInit, OnDestroy {
  @Input() bulkCsvPreviewComponent: BulkCsvPreviewComponent;
  @ViewChild('downloadEl', {static: false}) downloadEl: ElementRef;

  externalOrdersApiBaseUrl = `${environment.externalOrdersApiBaseUrl}/api/external-orders`;
  progress = 0;
  messageContent: string;
  messageType: string;
  isFileSelected = false;
  isFileCheked = false;
  isConfirmModalShow = false;
  csvModel: ICsvFileOrderResponse;
  loadPreviewBulkData: ICsvPreviewOrdersResponse[];
  allSub: Subject<any> = new Subject<any>();
  grantCSV = new FormGroup({
    file: new FormControl(null, [Validators.required, requiredFileType('csv')]),
  });

  constructor(
    protected authService: AuthService,
    private externalOrderService: ApiExternalOrderService,
  ) {}

  ngOnInit() {}

  fileLoad() {
    if (
      this.grantCSV.get('file').errors !== null &&
      this.grantCSV.get('file').errors.requiredFileType
    ) {
      this.messageContent = 'File can be only csv format';
      this.messageType = 'error';
      this.grantCSV.reset();
      return;
    }

    this.externalOrderService
      .bulkPreviewCsv(this.grantCSV.value)
      .pipe(
        uploadProgress((progress) => (this.progress = progress)),
        toResponseBody(),
      )
      .subscribe(
        (response: ICsvPreviewOrdersResponse[]) => {
          this.loadPreviewBulkData = response;
          this.progress = 0;
          this.isFileCheked = true;
          this.messageType = 'success';
          this.messageContent = 'File loaded successfuly, click upload to proceed!';

          this.externalOrderService.loadPreviewData(this.loadPreviewBulkData);
        },
        (failureResponse) => {
          this.progress = 0;
          this.isFileCheked = false;
          this.messageContent = failureResponse.error.message;
          this.messageType = 'error';

          this.externalOrderService.loadPreviewData([]);
        },
      );
  }

  confirmSubmit() {
    this.isConfirmModalShow = false;
    this.externalOrderService
      .bulkUpdateCsv(this.grantCSV.value)
      .pipe(
        uploadProgress((progress) => (this.progress = progress)),
        toResponseBody(),
      )
      .subscribe(
        (response: ICsvFileOrderResponse) => {
          this.csvModel = response;
          this.progress = 0;
          this.isFileCheked = false;
          this.messageType = 'success';
          this.messageContent = 'File uploaded successfuly!';
          this.grantCSV.reset();
          this.externalOrderService.loadPreviewData([]);
        },
        (failureResponse) => {
          this.progress = 0;
          this.isFileCheked = false;
          this.grantCSV.reset();
          this.messageContent = failureResponse.error.message;
          this.messageType = 'error';
          this.externalOrderService.loadPreviewData([]);
        },
      );
  }

  downloadCsv() {
    const fileObserver = this.externalOrderService.downloadOrdersCsv(this.grantCSV.value);
    downloadFile(fileObserver, this.downloadEl, `external-orders-`, null);
  }

  hasPermissions() {
    const permissions: IExternalOrderRole = getRolePermissions<IExternalOrderRole>(
      this.authService,
      retailRoles,
    );
    return permissions.hasExternalOrderUpdate;
  }

  isConfirmBtnDisabled(): boolean {
    return !this.isFileCheked;
  }

  isLoadCsvButtonDisabled(): boolean {
    return this.grantCSV.get('file').value === null;
  }

  confirmModalOpen(): void {
    this.isConfirmModalShow = true;
  }

  getConfirmModalState(): boolean {
    return this.isConfirmModalShow;
  }

  confirmCancel(): void {
    this.isConfirmModalShow = false;
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }
}
