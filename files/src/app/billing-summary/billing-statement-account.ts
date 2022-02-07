import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {BillingStatementAccountRoutingModule} from './billing-statement-account-routing.module';
import {BillingStatementAccountListingComponent} from './components/billing-account-statement.component';
// import {BillingStatementSummaryDetailsComponent} from './components/billing-statement-summary-details.component';
// import {BillingStatementSummaryTransactionsComponent} from './components/billing-statement.summary-transaction.component';
// import {BillingStatementSummaryListingComponent} from './components/billing-summary-listing.component';

@NgModule({
  declarations: [
    BillingStatementAccountListingComponent,
    // BillingStatementSummaryListingComponent,
    // BillingStatementSummaryDetailsComponent,
    // BillingStatementSummaryTransactionsComponent,
  ],
  imports: [BillingStatementAccountRoutingModule, ComponentsModule],
})
export class BillingStatementAccountModule {}
