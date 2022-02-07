import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billingReportsRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {BillingReportDetailsComponent} from './components/billing-report-details.component';
import {BillingReportListingComponent} from './components/billing-report-listing.component';

const routes: Routes = [
  {
    path: '',
    component: BillingReportListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingReportsRole.view],
    },
  },
  {
    path: 'billing-transactions-by-product-category',
    component: BillingReportDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingReportsRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingReportsRoutingModule {}
