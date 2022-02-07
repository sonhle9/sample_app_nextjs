import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalSwitchForceCloseApprovalListingComponent as TerminalSwitchForceCloseApprovalListingComponent} from './components/terminal-switch-force-close-approval-listing.component';
import {TerminalSwitchForceCloseApprovalDetailComponent} from './components/terminal-switch-force-close-approval-detail.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TerminalSwitchForceCloseApprovalListingComponent,
      },
      {
        path: ':batchId',
        component: TerminalSwitchForceCloseApprovalDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalSwitchForceCloseApprovalRoutingModules {}
