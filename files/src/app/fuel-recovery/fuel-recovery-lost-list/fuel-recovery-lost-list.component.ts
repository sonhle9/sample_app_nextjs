import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {FuelRecoveryService} from '../fuel-recovery.service';
import {merge, of as observableOf} from 'rxjs';
import {startWith, switchMap, map, catchError} from 'rxjs/operators';

@Component({
  selector: 'app-fuel-recovery-lost-list',
  templateUrl: './fuel-recovery-lost-list.component.html',
  styleUrls: ['./fuel-recovery-lost-list.component.scss'],
})
export class FuelRecoveryLostListComponent implements AfterViewInit, OnInit {
  private status = 'FUEL_ORDER_FULFILL_CONFIRMATION_LOST';
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  displayedColumns: string[] = [
    'name',
    'orderId',
    'userId',
    'stationName',
    'pump',
    'status',
    'createdAt',
  ];
  isLoadingResults = true;
  resultsLength: number;
  data: any;

  constructor(private fuelRecovery: FuelRecoveryService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.indexPendingRecovery();
  }

  indexPendingRecovery() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          return this.fuelRecovery.indexFuelRecoveryByStatus(
            this.status,
            this.paginator.pageSize,
            this.paginator.pageIndex,
          );
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.resultsLength = data.max;
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        }),
      )
      .subscribe((data) => (this.data = data));
  }
}
