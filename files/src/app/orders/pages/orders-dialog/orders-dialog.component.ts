import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-orders-dialog',
  templateUrl: './orders-dialog.component.html',
  styleUrls: ['./orders-dialog.component.scss'],
})
export class OrdersDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OrdersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.dialogRef.close(this.data.type);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
