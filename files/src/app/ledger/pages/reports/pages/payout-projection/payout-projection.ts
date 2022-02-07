import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import moment from 'moment';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {serviceHttpErrorHandler} from '../../../../../../shared/helpers/errorHandling';
import {ApiProcessorService} from '../../../../../api-processor.service';
import {ILedgerRole, IPayoutProjection} from '../../../../ledger.interface';
import {CalculateProjectionModalComponent} from './components/calculate-projection-modal.component';
import {IDialogData} from './payout-projection.type';

@Component({
  moduleId: module.id,
  selector: 'app-payout-projection',
  templateUrl: './payout-projection.html',
  styleUrls: ['./payout-projection.scss'],
})
export class PayoutProjectionComponent implements OnInit, OnDestroy {
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

  referenceDate: string;

  errorMessage = {
    endDate: '',
  };

  roles: ILedgerRole;

  dates: Array<IPayoutProjection & {preText: string}> = [];

  constructor(private processorService: ApiProcessorService, private dialog: MatDialog) {
    this.initSessionRoles();
  }

  ngOnInit() {
    this.getPayoutProjection();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initSessionRoles() {
    this.roles = this.processorService.getRolePermissions();
  }

  getPayoutProjection(loader = 'full') {
    this.loading[loader] = true;

    // Convert Local Date from Datepicker into equivalent date in UTC
    const referenceMoment = moment(this.referenceDate)
      .utc()
      .add(moment(this.referenceDate).utcOffset(), 'm')
      .startOf('day');

    const DAYS_BEFORE = 3;
    const DAYS_AFTER = 7;

    this.processorService
      .getPayoutProjection(referenceMoment.toISOString())
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (res) => {
          const currentIndex = res.findIndex((day) => day.isReference);
          const payouts = res.map((date, i) => {
            const projectionBase = currentIndex !== -1 && i >= currentIndex ? res[i - 7] : date; // if today or future date, use last week data
            return {
              ...date,
              totalAmount: projectionBase.totalAmount,
              totalFees: projectionBase.totalFees,
              preText: i < currentIndex ? 'Payout' : i === currentIndex ? 'Reference' : 'Projected',
            };
          });

          this.dates =
            currentIndex !== -1
              ? payouts.slice(currentIndex - DAYS_BEFORE, currentIndex + DAYS_AFTER)
              : payouts;

          this.loading.stop();
        },
        (err) => {
          serviceHttpErrorHandler(err);
          this.loading.stop();
        },
      );
  }

  get hasResult(): boolean {
    return this.dates.length > 0;
  }

  get consecutiveOffDays(): number {
    let result = 0;
    const currentIndex = this.dates.findIndex((d) => d.isReference);
    let dayIndex = currentIndex !== -1 ? currentIndex + 1 : undefined;
    while (dayIndex && (this.dates[dayIndex].isHoliday || this.dates[dayIndex].isWeekend)) {
      result++;
      dayIndex++;
    }
    return result;
  }

  openDialog() {
    this.dialog.open<CalculateProjectionModalComponent, IDialogData>(
      CalculateProjectionModalComponent,
      {
        width: '500px',
        data: {
          referenceDate: this.referenceDate,
          numOfHolidayOrWeekend: this.consecutiveOffDays,
        },
      },
    );
  }

  filter() {
    this.getPayoutProjection();
  }
}
