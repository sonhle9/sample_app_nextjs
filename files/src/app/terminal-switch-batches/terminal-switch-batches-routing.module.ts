import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalSwitchBatchListingComponent} from './components/terminal-switch-batch-listing.component';
import {TerminalSwitchBatchDetailComponent} from './components/terminal-switch-batch-detail.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TerminalSwitchBatchListingComponent,
      },
      {
        path: ':batchId',
        component: TerminalSwitchBatchDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalSwitchBatchesRoutingModules {}
