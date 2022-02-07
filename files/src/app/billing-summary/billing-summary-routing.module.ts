import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billingStatementSummaryRoles} from '../../shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
// import {BillingStatementAccountListingComponent} from './components/billing-account-statement.component';
import {BillingStatementSummaryDetailsComponent} from './components/billing-statement-summary-details.component';
import {BillingStatementSummaryTransactionsComponent} from './components/billing-statement.summary-transaction.component';
import {BillingStatementSummaryListingComponent} from './components/billing-summary-listing.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: BillingStatementAccountListingComponent,
  //   canActivate: [AuthResolver],
  //   data: {
  //     roles: [billingStatementSummaryRoles.view],
  //   },
  // },
  // TODO: statement account detail
  {
    path: '',
    component: BillingStatementSummaryListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingStatementSummaryRoles.view],
    },
  },
  {
    path: ':id',
    component: BillingStatementSummaryDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingStatementSummaryRoles.view],
    },
  },
  {
    path: ':id/transactions',
    component: BillingStatementSummaryTransactionsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingStatementSummaryRoles.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingStatementSummaryRoutingModule {}
