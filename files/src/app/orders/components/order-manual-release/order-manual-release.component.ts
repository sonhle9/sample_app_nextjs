import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiOrderService} from '../../../api-orders.service';
import {OrderManualReleaseConfirmDialogComponent} from './order-manual-release-confirm-dialog.component';

@Component({
  selector: 'app-order-manual-release',
  templateUrl: './order-manual-release.component.html',
  styleUrls: ['./order-manual-release.component.scss'],
})
export class OrderManualReleaseComponent implements OnInit, OnDestroy {
  @Input()
  orderId: string;

  isLoading = false;

  constructor(public dialog: MatDialog, private orderService: ApiOrderService) {}

  ngOnInit() {}

  ngOnDestroy() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(OrderManualReleaseConfirmDialogComponent, {
      width: '350px',
      data: {orderId: this.orderId},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handleManualRelease();
      }
    });
  }

  handleManualRelease() {
    this.isLoading = true;
    this.orderService.orderManualRelease(this.orderId).subscribe(
      (_res) => {
        this.isLoading = false;
      },
      (err) => {
        if (err.error && err.error.message) {
          alert(err.error.message);
        }

        this.isLoading = false;
      },
    );
  }
}
