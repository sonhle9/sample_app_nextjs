import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ApiLoyaltyService} from 'src/app/api-loyalty.service';
import {DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MY_FORMATS} from 'src/shared/helpers/displayDateFormat';

@Component({
  selector: 'app-grant-points-modal',
  templateUrl: './grant-points-modal.component.html',
  styleUrls: ['./grant-points-modal.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class GrantPointsModalComponent implements OnInit {
  grandTotal: number;
  transactionId: string;
  transactionDateTime: Date;
  referenceId: string;
  userId: string;

  isLoadingResults: boolean;
  message: string;
  messageType: string;

  constructor(
    public dialogRef: MatDialogRef<GrantPointsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected loyaltyService: ApiLoyaltyService,
  ) {
    this.userId = this.data.userId;
    this.grandTotal = this.data.grandTotal;
  }

  ngOnInit() {}

  onSubmit() {
    this.isLoadingResults = true;
    this.loyaltyService
      .manuallyGrantLoyaltyPoints(
        this.userId,
        +this.grandTotal,
        this.transactionId,
        this.transactionDateTime,
        this.referenceId,
      )
      .subscribe(
        (transaction) => {
          this.isLoadingResults = false;
          this.dialogRef.close({status: 'success', data: transaction});
        },
        (err) => {
          const defaultErrorMessage = 'Oops! Unable to grant Loyalty points.';
          this.messageType = 'error';
          this.message = (err.error && err.error.message) || defaultErrorMessage;
          this.isLoadingResults = false;
        },
      );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
