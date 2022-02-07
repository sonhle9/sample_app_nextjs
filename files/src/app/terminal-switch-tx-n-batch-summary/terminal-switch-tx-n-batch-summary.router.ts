import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalSwitchTxNBatchSummaryListingComponent as TerminalSwitchTxNBatchSummaryListingComponent} from './components/terminal-switch-tx-n-batch-summary-listing.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TerminalSwitchTxNBatchSummaryListingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalSwitchTxNBatchSummaryRoutingModules {}
