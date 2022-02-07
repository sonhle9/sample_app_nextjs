import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-order-manual-release-confirm-dialog',
  templateUrl: './order-manual-release-confirm-dialog.component.html',
  styleUrls: ['./order-manual-release-confirm-dialog.component.scss'],
})
export class OrderManualReleaseConfirmDialogComponent implements OnInit, OnDestroy {
  @Input()
  orderId: string;

  constructor(
    public dialogRef: MatDialogRef<OrderManualReleaseConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onSubmit() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
