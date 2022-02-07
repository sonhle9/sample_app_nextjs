import {Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {IPag} from '../../../../shared/interfaces/core.interface';
import {ApiPaymentsService} from '../../../api-payments.service';
import {resetPag} from '../../../../shared/helpers/common';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {ApiReportsService} from '../../../api-reports-service';
import {downloadFile} from '../../../../shared/helpers/common';

@Component({
  selector: 'app-balance-batch-upload-history',
  templateUrl: './balanceBatchUploadHistory.component.html',
  styleUrls: ['./balanceBatchUploadHistory.component.scss'],
})
export class BalanceBatchUploadHistoryComponent implements OnInit, OnDestroy {
  data = [];
  pagination: IPag;
  @ViewChild('fileNameColumnTpl', {static: true})
  fileNameColumnTpl: TemplateRef<any>;

  @ViewChild('failedFileColumnTpl', {static: true})
  failedFileColumnTpl: TemplateRef<any>;

  @ViewChild('downloadEl', {static: true})
  downloadEl: ElementRef;

  columns;

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

  allSub: Subject<any> = new Subject<any>();

  constructor(
    private paymentsService: ApiPaymentsService,
    private reportsService: ApiReportsService,
  ) {
    this.reset();
  }

  reset() {
    this.pagination = resetPag(1, 50);
  }

  ngOnInit() {
    this.columns = [
      {
        name: 'File Name',
        prop: 'fileName',
        flexGrow: 3,
        cellTemplate: this.fileNameColumnTpl,
      },
      {name: 'Granted successfully', prop: 'successfullTransactionsCount', flexGrow: 0.8},
      {name: 'Granted failed', prop: 'failureTransactionsCount', flexGrow: 0.8},
      {name: 'User id', prop: 'userId', flexGrow: 1.5},
      {
        name: 'Failed file',
        flexGrow: 0.8,
        cellTemplate: this.failedFileColumnTpl,
      },
    ];
    this.indexBalanceBatchUploadHistory('page');
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }

  nextPage() {
    if (this.loading.any) {
      return;
    }

    this.pagination.page++;
    this.indexBalanceBatchUploadHistory('page');
  }

  prevPage() {
    if (this.loading.any || this.pagination.page <= 1) {
      return;
    }

    this.pagination.page--;
    this.indexBalanceBatchUploadHistory('page');
  }

  isNextPageDisabled() {
    return this.data.length < this.pagination.perPage;
  }

  getData() {
    return this.data;
  }

  getColumns() {
    return this.columns;
  }

  downloadOriginalFile(row) {
    const {fileName, fileId} = row;
    const fileObserver = this.reportsService.originalBulkWalletGrantFile(fileId);
    downloadFile(fileObserver, this.downloadEl, fileName, null);
  }

  downloadFailedFile(row) {
    const {fileName, fileId} = row;
    const fileObserver = this.reportsService.failedBulkWalletGrantFile(fileId);
    downloadFile(fileObserver, this.downloadEl, `failed_${fileName}`, null);
  }

  isFailedTransactionExist(row): boolean {
    return row.failureTransactionsCount > 0;
  }

  indexBalanceBatchUploadHistory(loader = 'full') {
    this.loading[loader] = true;
    this.paymentsService
      .indexBalanceBatchUploadHistory(this.pagination.page, this.pagination.perPage)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          if (res.items && res.items.length > 0) {
            this.data = res.items;
          } else {
            if (this.pagination.page > 1) {
              this.pagination.page--;
            } else {
              this.data = res.items;
            }
          }

          this.loading.stop();
        },
        (err) => {
          this.data = [];
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }
}
