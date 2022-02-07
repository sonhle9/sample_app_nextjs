import {Pipe, PipeTransform} from '@angular/core';
import {TransactionSubType} from 'src/app/stations/shared/const-var';

@Pipe({
  name: 'dashboardTxnStatus',
})
export class DashboardTxnStatusPipe implements PipeTransform {
  dashboardStatus = {
    [TransactionSubType.topupBankAccount]: 'Bank',
    [TransactionSubType.topupCreditCard]: 'Payment Card',
  };

  transform(status: string): string {
    return this.dashboardStatus[status] || '';
  }
}
