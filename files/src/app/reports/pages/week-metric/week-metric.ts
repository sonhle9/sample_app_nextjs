import {Component, OnInit} from '@angular/core';
import {ApiMetricService} from 'src/app/api-metric-service';
import {Subject} from 'rxjs';
import {IMetricRport, IDateRange} from 'src/shared/interfaces/metric.interface';
import {takeUntil} from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-week-metric',
  templateUrl: './week-metric.html',
  styleUrls: ['./week-metric.scss'],
})
export class WeekMetricComponent implements OnInit {
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
  metric: IMetricRport;

  constructor(private apiMetricService: ApiMetricService) {}

  ngOnInit() {
    this.loading.page = true;
    this.apiMetricService
      .metric()
      .pipe(takeUntil(this.allSub))
      .subscribe(
        (metric) => {
          this.metric = metric;
          this.loading.stop();
        },
        () => {
          this.metric = null;
          this.loading.stop();
        },
      );
  }

  formatDateIntervals(daterange: IDateRange) {
    if (!daterange) {
      return '';
    }

    const {from, to} = daterange;
    if (!from || !to) {
      return '';
    }
    return `${moment(from).utc().format('DD MMM YY')} - ${moment(to).utc().format('DD MMM YY')}`;
  }
}
