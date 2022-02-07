import {Component, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import moment from 'moment';

import {IPagination} from '../../../../shared/interfaces/core.interface';
import {ApiPaymentsService} from '../../../api-payments.service';
import {serviceHttpErrorHandler} from '../../../../shared/helpers/errorHandling';
import {forceUpdate, resetPagination, numberWithCommas} from '../../../../shared/helpers/common';
import {IPrefundingBalanceDailySnapshot} from '../../../../shared/interfaces/prefundingBalance.interface';
import {
  MAX_TABLE_PAGE_ROWS,
  PREFUNDING_DAILY_SHAPSHOT_DATE_FORMAT,
} from '../../../stations/shared/const-var';

@Component({
  selector: 'app-prefunding-balance-daily-snapshots',
  templateUrl: './prefundingBalanceDailySnapshots.html',
  styleUrls: ['./prefundingBalanceDailySnapshots.scss'],
})
export class PrefundingBalanceDailySnapshotsComponent implements OnInit, OnDestroy, OnChanges {
  private _pagination: IPagination<IPrefundingBalanceDailySnapshot>;
  pagination: IPagination<IPrefundingBalanceDailySnapshot>;

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

  constructor(private paymentsService: ApiPaymentsService) {
    this.reset();
  }

  ngOnInit() {
    this.indexDailySnapshots();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  ngOnChanges() {
    this.reset();
    this.indexDailySnapshots();
  }

  indexDailySnapshots(loader = 'full') {
    this.pagination.items = [];
    this.loading[loader] = true;
    this.paymentsService
      .indexDailySnapshots(this.pagination.index, this.pagination.page)
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          this.pagination.max = this._pagination.max = res.max;
          this.pagination.items = this._pagination.items = res.items.map((item) => ({
            balance: `RM${numberWithCommas(item.balance)}`,
            date: moment(item.createdAt).format(PREFUNDING_DAILY_SHAPSHOT_DATE_FORMAT),
          }));
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
    this.indexDailySnapshots('page');
  }

  prev() {
    if (this.loading.any) {
      return;
    }

    this.pagination.index--;
    this.indexDailySnapshots('page');
  }

  reset() {
    this.pagination = this._pagination = resetPagination(MAX_TABLE_PAGE_ROWS);
  }
}
