import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import moment from 'moment';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {vouchersBatchRole} from 'src/shared/helpers/roles.type';
import {
  capitalize,
  forceUpdate,
  getStringEnumValues,
  resetPagination,
} from '../../../../shared/helpers/common';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {
  IVouchersBatch,
  VoucherBatchGenerationType,
  VoucherRedeemType,
  VouchersBatchStatus,
} from '../../../../shared/interfaces/vouchers.interface';
import {ApiVouchersService} from '../../../api-vouchers.service';

@Component({
  selector: 'app-vouchers-batches',
  templateUrl: './vouchersBatches.html',
  styleUrls: ['./vouchersBatches.scss'],
})
export class VouchersBatchesComponent implements OnInit, OnDestroy {
  private _pagination: IPagination<IVouchersBatch>;

  vouchersBatchRole = vouchersBatchRole;

  @ViewChild('batchNameColumnTpl', {static: true})
  batchNameColumnTpl: TemplateRef<any>;

  @ViewChild('downloadEl', {static: true})
  downloadEl: ElementRef;

  @ViewChild('datesColumnTpl', {static: true})
  datesColumnTpl: TemplateRef<any>;

  status: VouchersBatchStatus;
  type: VoucherRedeemType;
  name: string;

  startDateFrom: Date;
  startDateTo: Date;

  expiryDateFrom: Date;
  expiryDateTo: Date;

  statuses = getStringEnumValues(VouchersBatchStatus).map((key) => ({
    value: key,
    label: capitalize(key),
  }));
  redeemTypes = getStringEnumValues(VoucherRedeemType).map((key) => ({
    value: key,
    label: capitalize(key),
  }));

  data: IVouchersBatch[];
  pagination: IPagination<IVouchersBatch>;
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

  downloadBatchesIds: string[] = [];

  constructor(private vouchersService: ApiVouchersService, private router: Router) {
    this.reset();
  }

  ngOnInit() {
    this.columns = [
      {name: 'Name', prop: 'name', flexGrow: 2, cellTemplate: this.batchNameColumnTpl},
      {name: 'Start Date', prop: 'startDate', flexGrow: 2, cellTemplate: this.datesColumnTpl},
      {name: 'Expiry Date', prop: 'expiryDate', flexGrow: 2, cellTemplate: this.datesColumnTpl},
      {name: 'Vouchers Count', prop: 'vouchersCount', flexGrow: 0.8},
      {name: 'Type', prop: 'redeemType', flexGrow: 1},
    ];
    this.indexVouchersBatches();
  }

  ngOnDestroy() {
    this.allSub.next();
    this.allSub.complete();
  }

  indexVouchersBatches(loader = 'full') {
    this.loading[loader] = true;
    const filters = {
      ...(this.status && {status: this.status}),
      ...(this.type && {type: this.type}),
      ...(this.name && {name: this.name}),
      ...(this.startDateFrom && {startDateFrom: this.startDateFrom}),
      ...(this.startDateTo && {startDateTo: this.formatToDate(this.startDateTo)}),
      ...(this.expiryDateFrom && {expiryDateFrom: this.expiryDateFrom}),
      ...(this.expiryDateTo && {expiryDateTo: this.formatToDate(this.expiryDateTo)}),
    };
    this.vouchersService
      .indexVouchersBatches(this.pagination.index, this.pagination.page, filters)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          if (res.items && res.items.length > 0) {
            this.pagination.max = this._pagination.max = res.max;
            this.pagination.items = this._pagination.items = res.items;
            this.pagination = forceUpdate(this.pagination);
            this.data = res.items;
          } else {
            if (this.pagination.index > 1) {
              this.pagination.index--;
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

  removeBatchIdFromDownloads(batchId: string) {
    this.downloadBatchesIds.splice(this.downloadBatchesIds.indexOf(batchId), 1);
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexVouchersBatches('page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexVouchersBatches('page');
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

  onStatusChange(status: {value: VouchersBatchStatus}) {
    this.reset();
    this.status = status.value;
    this.indexVouchersBatches();
  }

  onTypeChange(type: {value: VoucherRedeemType}) {
    this.reset();
    this.type = type.value;
    this.indexVouchersBatches();
  }

  onAnyDateChange() {
    this.reset();
    this.indexVouchersBatches();
  }

  isDisabled(batchId: string) {
    return this.downloadBatchesIds.includes(batchId);
  }

  isCsvDownloadable(value) {
    return value.generationType !== VoucherBatchGenerationType.ON_DEMAND;
  }

  formatToDate(date) {
    const formattedDate = moment(date).set({hour: 23, minute: 59, second: 59}).toISOString();
    return formattedDate;
  }
}
