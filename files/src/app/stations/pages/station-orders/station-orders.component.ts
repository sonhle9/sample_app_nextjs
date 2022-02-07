import {ApiStationsService} from 'src/app/api-stations.service';
import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {startWith, switchMap, map, catchError} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../auth.service';
import {retailRoles} from '../../../../shared/helpers/roles.type';

@Component({
  selector: 'app-station-orders',
  templateUrl: './station-orders.component.html',
  styleUrls: ['./station-orders.component.scss'],
})
export class StationOrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['status', 'name', 'createOn', 'pump', 'amount'];
  data: any[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  sub: any;
  stationId: string;

  hasPermission = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private stationsService: ApiStationsService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.hasPermission = this.authService.validatePermissions(retailRoles.fuelOrderView);
    this.sub = this.route.parent.params.subscribe((param) => {
      this.stationId = param['id'];
    });
  }

  ngAfterViewInit() {
    this.loadFuelOrdersByStation();
  }

  loadFuelOrdersByStation() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.stationsService.fuelOrdersByStation(
            this.stationId,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            false,
          );
        }),
        map((data: any) => {
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
