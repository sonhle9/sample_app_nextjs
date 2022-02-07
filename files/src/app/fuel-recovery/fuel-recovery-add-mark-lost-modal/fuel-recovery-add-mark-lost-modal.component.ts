import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IFuelRecoveryInfo} from '../interface/fuel-recovery.interface';
import {FuelRecoveryService} from '../fuel-recovery.service';

@Component({
  selector: 'app-fuel-recovery-add-mark-lost-modal',
  templateUrl: './fuel-recovery-add-mark-lost-modal.component.html',
  styleUrls: ['./fuel-recovery-add-mark-lost-modal.component.scss'],
})
export class FuelRecoveryAddMarkLostModalComponent implements OnInit {
  message: string;
  messageType: string;
  isLoadingResults: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IFuelRecoveryInfo,
    private fuelRecoveryService: FuelRecoveryService,
    public dialogRef: MatDialogRef<FuelRecoveryAddMarkLostModalComponent>,
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.isLoadingResults = true;
    this.fuelRecoveryService.updateLostOrder(this.data.orderId).subscribe(
      () => {
        this.isLoadingResults = false;
        this.dialogRef.close('success');
      },
      (err) => {
        this.isLoadingResults = false;
        this.messageType = 'error';
        this.message = err.error.message;
      },
    );
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
