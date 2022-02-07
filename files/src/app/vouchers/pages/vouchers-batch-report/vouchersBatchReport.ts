import {Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';

import {IPagination} from '../../../../shared/interfaces/core.interface';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {resetPagination, forceUpdate, downloadFile} from '../../../../shared/helpers/common';
import {IVouchersBatchReportItem} from '../../../../shared/interfaces/vouchers.interface';
import {ApiVouchersService} from '../../../api-vouchers.service';
import {ApiReportsService} from '../../../api-reports-service';
import {AuthService} from 'src/app/auth.service';
import {vouchersBatchReportRole} from 'src/shared/helpers/roles.type';

@Component({
  selector: 'app-vouchers-batch-report',
  templateUrl: './vouchersBatchReport.html',
  styleUrls: ['./vouchersBatchReport.scss'],
})
export class VouchersBatchReportComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<IVouchersBatchReportItem>;

  @ViewChild('batchNameColumnTpl', {static: true})
  batchNameColumnTpl: TemplateRef<any>;
  @ViewChild('downloadColumnTpl', {static: true})
  downloadColumnTpl: TemplateRef<any>;
  @ViewChild('datesColumnTpl', {static: true})
  datesColumnTpl: TemplateRef<any>;
  name: string;
  @ViewChild('downloadEl', {static: true})
  downloadEl: ElementRef;

  data: IVouchersBatchReportItem[];
  pagination: IPagination<IVouchersBatchReportItem>;
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

  errorMessage = {
    endDate: '',
  };

  csvLoadingItems = [];

  constructor(
    private vouchersService: ApiVouchersService,
    private router: Router,
    private reportsService: ApiReportsService,
    private authService: AuthService,
  ) {
    this.reset();
  }

  ngOnInit() {
    this.columns = [
      {name: 'Name', prop: 'name', flexGrow: 2, cellTemplate: this.batchNameColumnTpl},
      {
        name: 'Vouchers Count',
        prop: 'vouchersCount',
        flexGrow: 1,
      },
      {name: 'Type', prop: 'redeemType', flexGrow: 1},
      {name: 'Start Date', prop: 'startDate', flexGrow: 2, cellTemplate: this.datesColumnTpl},
      {name: 'Expiry Date', prop: 'expiryDate', flexGrow: 2, cellTemplate: this.datesColumnTpl},
      {name: 'Top-up Regular Amount', prop: 'regularAmount', flexGrow: 2},
      {name: 'Top-up Bonus Amount', prop: 'bonusAmount', flexGrow: 2},
      {name: 'Issued', prop: 'issued', flexGrow: 0.8},
      {name: 'Redeemed', prop: 'redeemed', flexGrow: 0.8},
      {name: 'Linked', prop: 'linked', flexGrow: 0.8},
      {name: 'Gifted', prop: 'gifted', flexGrow: 0.8},
      {name: 'Expired', prop: 'expired', flexGrow: 0.8},
      {name: 'Voided', prop: 'voided', flexGrow: 0.8},
    ];

    if (this.authService.validatePermissions(vouchersBatchReportRole.download)) {
      this.columns.push({name: 'Download', flexGrow: 2, cellTemplate: this.downloadColumnTpl});
    }
    this.indexVouchersBatchesReport();
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }

  indexVouchersBatchesReport(loader = 'full') {
    this.loading[loader] = true;
    const filters = {
      ...(this.name && {name: this.name}),
    };
    this.vouchersService
      .indexVouchersBatchesReport(this.pagination.index, this.pagination.page, filters)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          if (res.items && res.items.length > 0) {
            this.pagination.max = this._pagination.max = res.max;
            this.pagination.items = this._pagination.items = res.items;
            this.pagination = forceUpdate(this.pagination);
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
          this.pagination.items = [];
          this.data = [];
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  async downloadReport({batchId, name}) {
    this.csvLoadingItems.push(batchId);
    const fileObserver = this.reportsService.vouchersReportFile(batchId);
    downloadFile(fileObserver, this.downloadEl, name, null).finally(() =>
      this.removeCsvLoadingItem(batchId),
    );
  }

  removeCsvLoadingItem(item) {
    this.csvLoadingItems = this.csvLoadingItems.filter((val) => item !== val);
  }

  next() {
    if (this.loading.any) {
      return;
    }
    this.pagination.index++;
    this.indexVouchersBatchesReport('page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }
    this.pagination.index--;
    this.indexVouchersBatchesReport('page');
  }

  reset() {
    this.pagination = this._pagination = resetPagination(20);
  }

  getData() {
    return this.data;
  }

  getColumns() {
    return this.columns;
  }

  goToBatchCreatePage() {
    this.router.navigate(['gifts/batches/create']);
  }

  isCsvLoading({batchId}) {
    return this.csvLoadingItems.includes(batchId);
  }

  performNameSearch() {
    this.reset();
    this.indexVouchersBatchesReport();
  }
}
