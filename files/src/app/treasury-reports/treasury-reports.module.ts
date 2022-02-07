import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {TreasuryReportsDetailsComponent} from './pages/treasury-reports-details.component';
import {TreasuryReportsDownloadComponent} from './pages/treasury-reports-download.component';
import {TreasuryReportsLandingComponent} from './pages/treasury-reports-landing.component';
import {TrusteeReportDetailsComponent} from './pages/trustee/trustee-report-details.component';
import {TrusteeReportComponent} from './pages/trustee/trustee-report.component';
import {TreasuryReportsRoutingModule} from './treasury-reports-routing-module';
@NgModule({
  declarations: [
    TreasuryReportsLandingComponent,
    TrusteeReportComponent,
    TrusteeReportDetailsComponent,
    TreasuryReportsDetailsComponent,
    TreasuryReportsDownloadComponent,
  ],
  imports: [CommonModule, ComponentsModule, TreasuryReportsRoutingModule],
})
export class TreasuryReportsModule {}
