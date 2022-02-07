import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {startWith, switchMap, map, catchError} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {merge, of as observableOf} from 'rxjs';

import {FuelRecoveryService} from './../fuel-recovery.service';
import {FuelRecoveryAddInfoModalComponent} from '../fuel-recovery-add-info-modal/fuel-recovery-add-info-modal.component';
import {FuelRecoveryAddMarkLostModalComponent} from '../fuel-recovery-add-mark-lost-modal/fuel-recovery-add-mark-lost-modal.component';
import {IOrderRole} from '../../../shared/interfaces/order.interface';
import {ApiOrderService} from '../../api-orders.service';

@Component({
  selector: 'app-fuel-recovery-pending-list',
  templateUrl: './fuel-recovery-pending-list.component.html',
  styleUrls: ['./fuel-recovery-pending-list.component.scss'],
})
export class FuelRecoveryPendingListComponent implements AfterViewInit, OnInit {
  private status = 'FUEL_ORDER_FULFILL_CONFIRMATION_NO_RESP';
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  displayedColumns: string[] = [
    'name',
    'orderId',
    'userId',
    'stationName',
    'pump',
    'status',
    'createdAt',
    'action',
  ];
  isLoadingResults = true;
  resultsLength: number;
  message: string;
  messageType: string;
  data: any;
  roles: IOrderRole;

  constructor(
    private fuelRecovery: FuelRecoveryService,
    public dialog: MatDialog,
    private orderService: ApiOrderService,
  ) {
    this.initSessionRoles();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.indexPendingRecovery();
  }

  initSessionRoles() {
    this.roles = this.orderService.getRolePermissions();
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

  openAddRecoveryDataModal(item): void {
    const dialogRef = this.dialog.open(FuelRecoveryAddInfoModalComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'Recovery info successfully updated';
        this.indexPendingRecovery();
      }
    });
  }

  openMarkAsLostModal(item): void {
    const dialogRef = this.dialog.open(FuelRecoveryAddMarkLostModalComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.messageType = 'success';
        this.message = 'Order has successfully updated';
        this.indexPendingRecovery();
      }
    });
  }
}
