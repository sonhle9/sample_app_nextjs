import {
  Component,
  OnDestroy,
  Input,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

import {NotificationService} from 'src/app/notification.service';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {
  IVouchersBatch,
  IVouchersBatchBreakdown,
  VoucherBatchGenerationType,
} from '../../../../shared/interfaces/vouchers.interface';
import {ApiVouchersService} from '../../../api-vouchers.service';
import {AppEmitter} from '../../../emitter.service';
import {downloadFile} from '../../../../shared/helpers/common';
import {ApiReportsService} from '../../../api-reports-service';
import {vouchersBatchRole, vouchersRole} from 'src/shared/helpers/roles.type';
import {AuthService} from 'src/app/auth.service';

@Component({
  selector: 'app-vouchers-batch-details',
  templateUrl: './vouchersBatchDetails.html',
  styleUrls: ['./vouchersBatchDetails.scss'],
})
export class VouchersBatchDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('ruleExpiryDateColumnTpl', {static: true})
  ruleExpiryDateColumnTpl: TemplateRef<any>;
  @ViewChild('downloadEl', {static: true})
  downloadEl: ElementRef;

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

  vouchersRole = vouchersRole;
  vouchersBatchRole = vouchersBatchRole;
  batch: IVouchersBatch;
  batchBreakdown: IVouchersBatchBreakdown;
  rulesColumns = [];
  allSub: Subject<any> = new Subject<any>();
  isShowVoidVoucherModal = false;
  isCsvLoading = false;

  constructor(
    route: ActivatedRoute,
    protected authService: AuthService,
    private vouchersService: ApiVouchersService,
    private router: Router,
    private notificationService: NotificationService,
    private reportsService: ApiReportsService,
  ) {
    route.params.pipe(takeUntil(this.allSub)).subscribe((param) => {
      this.init(param.id);
    });
  }

  ngOnInit(): void {
    this.rulesColumns = [
      {name: 'Name', prop: 'name', flexGrow: 2},
      {
        name: 'Expiry Date',
        prop: 'expiryDate',
        flexGrow: 2,
        cellTemplate: this.ruleExpiryDateColumnTpl,
      },
      {name: 'Days to expire', prop: 'daysToExpire', flexGrow: 1},
      {name: 'Type', prop: 'type', flexGrow: 1},
      {name: 'Amount', prop: 'amount', flexGrow: 1},
      {name: 'Tag', prop: 'tag', flexGrow: 1},
    ];
  }

  init(id, loader = 'full') {
    this.loading[loader] = true;
    this.vouchersService
      .getBatchById(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.batch = res;
          this.loading.stop();
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }

          serviceHttpErrorHandler(err);
          this.loading.stop();
          this.batch = null;
          this.router.navigate(['gifts/voucher-batches']);
        },
      );

    this.vouchersService
      .getBatchBreakdownById(id)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.batchBreakdown = res;
          this.loading.stop();
        },
        (err) => {
          if (err instanceof PermissionDeniedError) {
            return AppEmitter.get(AppEmitter.PermissionDenied).emit();
          }

          serviceHttpErrorHandler(err);
          this.loading.stop();
          this.batchBreakdown = null;
        },
      );
  }

  onVoucherVoided(): void {
    this.closeVoidVoucherModal();
    this.notificationService.showMessage({
      title: 'Voucher successfully voided',
      variant: 'success',
    });
  }

  openVoidVoucherModal(): void {
    this.isShowVoidVoucherModal = true;
  }

  closeVoidVoucherModal(): void {
    this.isShowVoidVoucherModal = false;
  }

  stopCsvDownload() {
    this.isCsvLoading = false;
  }

  downloadBatchCsv() {
    this.isCsvLoading = true;
    const fileObserver = this.reportsService.voucherBatchCsvFile(
      this.batch._id,
      this.stopCsvDownload.bind(this),
    );
    downloadFile(fileObserver, this.downloadEl, `vouchers_${this.batch._id}`, null).catch(
      this.stopCsvDownload.bind(this),
    );
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  isCsvDownloadable() {
    return (
      this.batch &&
      this.batch.generationType !== VoucherBatchGenerationType.ON_DEMAND &&
      this.authService.validatePermissions(vouchersBatchRole.download)
    );
  }

  cloneBatch() {
    this.router.navigate(['gifts/batches/clone', this.batch._id]);
  }

  editBatch() {
    const urlTree = this.router.serializeUrl(
      this.router.createUrlTree(['gifts/batches/edit', this.batch._id]),
    );
    window.open(urlTree, '_blank');
  }
}
