import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from 'src/app/auth.guard';
import {merchantReportAccess} from 'src/shared/helpers/pdb.roles.type';
import {GiftCardTransactionsSummaryListComponent} from './gift-card-transactions-summary-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthResolver],
    component: GiftCardTransactionsSummaryListComponent,
    data: {
      roles: [merchantReportAccess.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftCardTransactionsSummaryRoutingModule {}
