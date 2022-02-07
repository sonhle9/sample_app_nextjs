import {Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {IPagination} from '../../../../shared/interfaces/core.interface';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {resetPagination, forceUpdate, downloadFile} from '../../../../shared/helpers/common';
import {
  IExtVoucherReport,
  IIndexExtVouchersReportFilters,
} from '../../../../shared/interfaces/vouchers.interface';
import {ApiVouchersService} from '../../../api-vouchers.service';
import {ApiReportsService} from '../../../api-reports-service';

@Component({
  selector: 'app-ext-vouchers-report',
  templateUrl: './extVouchersReport.html',
  styleUrls: ['./extVouchersReport.scss'],
})
export class ExtVouchersReportComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<IExtVoucherReport[]>;

  @ViewChild('datesColumnTpl', {static: true})
  datesColumnTpl: TemplateRef<any>;

  @ViewChild('matchColumnTpl', {static: true})
  matchColumnTpl: TemplateRef<any>;

  @ViewChild('downloadEl', {static: true})
  downloadEl: ElementRef;

  name: string;
  match: boolean;

  dateFrom: Date;
  dateTo: Date;

  matchTypes = [
    {value: false, label: 'No'},
    {value: true, label: 'Yes'},
  ];

  data: IExtVoucherReport[];
  pagination: IPagination<IExtVoucherReport[]>;
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

  isCsvLoading = false;

  constructor(
    private vouchersService: ApiVouchersService,
    private reportsService: ApiReportsService,
  ) {
    this.reset();
  }

  ngOnInit() {
    this.columns = [
      {name: 'File name', prop: 'docName', flexGrow: 2},
      {name: 'Date', prop: 'records.date', flexGrow: 1.5, cellTemplate: this.datesColumnTpl},
      {name: 'Title', prop: 'records.title', flexGrow: 1},
      {name: 'Serial Number', prop: 'records.voucherSerialNumber', flexGrow: 2},
      {name: 'Voucher Code', prop: 'records.voucherCode', flexGrow: 1},
      {name: 'Value (RM)', prop: 'records.value', flexGrow: 0.8},
      {name: 'Terminal Id ', prop: 'records.terminalId', flexGrow: 1},
      {name: 'Retailer Name', prop: 'records.retailerName', flexGrow: 1.5},
      {name: 'Match', prop: 'records.match', flexGrow: 0.8, cellTemplate: this.matchColumnTpl},
    ];
    this.indexExtVouchersReport();
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }

  indexExtVouchersReport(loader = 'full') {
    this.loading[loader] = true;
    this.vouchersService
      .indexExtVouchersReport(this.pagination.index, this.pagination.page, this.getFiltersData())
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination = forceUpdate(this.pagination);
          this.data = res.items;
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

  getFiltersData(): IIndexExtVouchersReportFilters {
    return {
      ...(typeof this.match === 'boolean' && {match: this.match}),
      ...(this.dateFrom && {startDate: this.dateFrom.toISOString()}),
      ...(this.dateTo && {endDate: this.dateTo.toISOString()}),
    };
  }

  next() {
    if (this.loading.any) {
      return;
    }
    this.pagination.index++;
    this.indexExtVouchersReport('page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }
    this.pagination.index--;
    this.indexExtVouchersReport('page');
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

  onMatchChange({value}: {value: boolean}) {
    this.reset();
    this.match = value;
    this.indexExtVouchersReport();
  }

  onAnyDateChange() {
    this.reset();
    this.indexExtVouchersReport();
  }

  stopCsvDownload() {
    this.isCsvLoading = false;
  }

  downloadCsv() {
    this.isCsvLoading = true;
    const fileObserver = this.reportsService.extVouchersReportCsvFile(
      this.pagination.index,
      this.pagination.page,
      this.getFiltersData(),
      this.stopCsvDownload.bind(this),
    );
    downloadFile(fileObserver, this.downloadEl, `ext_vouchers_report`, null).catch(
      this.stopCsvDownload.bind(this),
    );
  }
}
