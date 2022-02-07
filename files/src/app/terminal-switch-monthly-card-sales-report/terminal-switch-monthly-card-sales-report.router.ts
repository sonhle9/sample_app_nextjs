import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalSwitchMonthlyCardSalesReportComponent} from './components/terminal-switch-monthly-card-sales-report.component';
import {TerminalSwitchMonthlyCardSalesReportListingComponent} from './components/terminal-switch-monthy-card-sales-report-listing.component';
const routes: Routes = [
  {
    path: '',
    component: TerminalSwitchMonthlyCardSalesReportComponent,
    children: [
      {
        path: '',
        component: TerminalSwitchMonthlyCardSalesReportListingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalSwitchMonthlyCardSalesReportRouter {}
