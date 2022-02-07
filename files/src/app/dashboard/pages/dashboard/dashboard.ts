import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject, interval} from 'rxjs';
import {
  IFailedOrder,
  IDashboardTemplate,
  IFailTopup,
  IOrderDashboard,
} from 'src/shared/interfaces/dashboard.interface';
import {takeUntil, map} from 'rxjs/operators';
import {convertMinuteToMilliSeconds, generateDashboard} from 'src/shared/helpers/common';
import moment from 'moment';
import {ApiDashboardService} from 'src/app/api-dashboard.service';
import {ApiStoreOrderService} from '../../../api-store-orders.service';
import {IStoreOrderDashboard} from '../../../../shared/interfaces/storeOrder.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  failOrders: IFailedOrder[];
  failTopups: IFailTopup[];
  orderDashboard: IOrderDashboard = {
    fuelStatistics: {},
    topupPendingStatus: {},
    topupStatistics: {},
    fuelProcessErrorStatistics: {},
  };
  storeOrderDashboard: IStoreOrderDashboard;

  allSub: Subject<any> = new Subject<any>();

  dashboards: {[key: string]: IDashboardTemplate} = {
    topfailedOrders: generateDashboard(() => this.queryTopFailedOrders()),
    topfailedTopups: generateDashboard(() => this.queryTopFailedTopups()),
    ordersDashboard: generateDashboard(() => this.queryOrderDashboard()),
    storeOrderDashboard: generateDashboard(() => this.queryStoreOrderDashboard()),
  };

  constructor(
    private dashboardService: ApiDashboardService,
    private apiStoreOrderService: ApiStoreOrderService,
  ) {}

  ngOnInit() {
    const allKeys = Object.keys(this.dashboards);
    for (const key of allKeys) {
      this.initDashboard(key);
      interval(convertMinuteToMilliSeconds(1))
        .pipe(takeUntil(this.allSub))
        .subscribe(() => {
          this.initDashboard(key);
        });
    }
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  initDashboard(key) {
    this.dashboards[key].isLoading = true;
    this.dashboards[key]
      .apiFunction()
      .pipe(takeUntil(this.allSub))
      .subscribe(() => {
        this.dashboards[key].isLoading = false;
      });
  }

  queryTopFailedOrders() {
    return this.dashboardService
      .topFailedOrders(20)
      .pipe(map((orders) => (this.failOrders = orders)));
  }

  queryTopFailedTopups() {
    return this.dashboardService
      .topFailedTopups(20)
      .pipe(map((topups) => (this.failTopups = topups)));
  }

  queryOrderDashboard() {
    return this.dashboardService.ordersDashboard().pipe(
      map((order) => {
        this.orderDashboard = order;
      }),
    );
  }

  queryStoreOrderDashboard() {
    return this.apiStoreOrderService
      .ordersDashboard()
      .pipe(
        map(
          (storeOrderDashboard: IStoreOrderDashboard) =>
            (this.storeOrderDashboard = storeOrderDashboard),
        ),
      );
  }

  hasLatestCssClass(createdAt: string) {
    return moment(createdAt).isAfter(moment().subtract(1, 'h')) ? 'latest' : '';
  }

  hasMoreThanMinutes(minute: number) {
    return minute >= 5 ? 'error' : '';
  }
}
