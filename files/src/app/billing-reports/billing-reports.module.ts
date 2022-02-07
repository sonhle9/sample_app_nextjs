import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {BillingReportsRoutingModule} from './billing-reports-routing.module';
import {BillingReportDetailsComponent} from './components/billing-report-details.component';
import {BillingReportListingComponent} from './components/billing-report-listing.component';

@NgModule({
  declarations: [BillingReportDetailsComponent, BillingReportListingComponent],
  imports: [BillingReportsRoutingModule, ComponentsModule],
})
export class BillingReportsModule {}
