import {MY_FORMATS} from './../../../../shared/helpers/displayDateFormat';
import {Component, OnInit, Inject} from '@angular/core';
import moment from 'moment';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ApiCustomersService} from './../../../../app/api-customers.service';
import {ICustomBudget} from './../../../../shared/interfaces/customer.interface';
import {DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
  selector: 'app-customer-statement-modal',
  templateUrl: './customer-statement-modal.component.html',
  styleUrls: ['./customer-statement-modal.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CustomerStatementModalComponent implements OnInit {
  todayDate = new Date();
  startDate: Date;
  endDate: Date;
  message: string;
  messageType: string;

  constructor(
    public dialogRef: MatDialogRef<CustomerStatementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected customerService: ApiCustomersService,
  ) {}

  ngOnInit() {}

  customStatementPayload(): ICustomBudget {
    return {
      type: 'custom',
      startDate: moment(this.startDate).startOf('day').toISOString(),
      endDate: moment(this.endDate).endOf('day').toISOString(),
    };
  }

  onSubmit() {
    this.customerService.customBudgets(this.data, this.customStatementPayload()).subscribe(
      (res) => {
        if (res) {
          this.dialogRef.close('success');
        }
      },
      () => {
        this.messageType = 'error';
        this.message = `Something went wrong!!`;
      },
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
