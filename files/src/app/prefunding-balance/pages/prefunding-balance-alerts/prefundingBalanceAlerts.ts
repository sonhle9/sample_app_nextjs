import {Component, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {IPagination} from '../../../../shared/interfaces/core.interface';
import {Subject} from 'rxjs';
import {ApiPaymentsService} from '../../../api-payments.service';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, resetPagination} from '../../../../shared/helpers/common';
import {IPrefundingBalanceAlert} from '../../../../shared/interfaces/prefundingBalance.interface';
import {MAX_TABLE_PAGE_ROWS} from '../../../stations/shared/const-var';

@Component({
  selector: 'app-prefunding-balance-alerts',
  templateUrl: './prefundingBalanceAlerts.html',
  styleUrls: ['./prefundingBalanceAlerts.scss'],
})
export class PrefundingBalanceAlertsComponent implements OnInit, OnDestroy, OnChanges {
  private _pagination: IPagination<IPrefundingBalanceAlert>;
  pagination: IPagination<IPrefundingBalanceAlert>;

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

  isShowAddPrefundingAlertModal = false;

  constructor(private paymentsService: ApiPaymentsService) {
    this.reset();
  }

  ngOnInit() {
    this.indexAlerts();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  ngOnChanges() {
    this.reset();
    this.indexAlerts();
  }

  indexAlerts(loader = 'full') {
    this.pagination.items = [];
    this.loading[loader] = true;
    this.paymentsService
      .indexPrefundingBalanceAlerts(this.pagination.index, this.pagination.page)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination.items = this._pagination.items = res.items;
          this.pagination = forceUpdate(this.pagination);
          this.loading.stop();
        },
        (err) => {
          this.pagination.items = [];
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  next() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index++;
    this.indexAlerts('page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexAlerts('page');
  }

  reset() {
    this.pagination = this._pagination = resetPagination(MAX_TABLE_PAGE_ROWS);
  }

  onAlertAdded(): void {
    this.closeAddPrefundingAlertModal();
    this.indexAlerts();
  }

  openAddPrefundingAlertModal(): void {
    this.isShowAddPrefundingAlertModal = true;
  }

  closeAddPrefundingAlertModal(): void {
    this.isShowAddPrefundingAlertModal = false;
  }

  removeAlert(_, alertId) {
    this.paymentsService
      .deletePrefundingBalanceAlert(alertId)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        () => {
          this.indexAlerts();
        },
        (err) => {
          serviceHttpErrorHandler(err);
        },
      );
  }
}
