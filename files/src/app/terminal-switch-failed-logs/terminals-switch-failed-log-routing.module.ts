import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalSwitchFailedLogComponent} from './components/ terminal-switch-failed-log.component';
import {TerminalSwitchFailedLogsDetailComponent} from './components/terminal-switch-failed-log-detail.component';
import {TerminalSwitchFailedLogsListingComponent} from './components/terminal-switch-failed-log-listing.component';
const routes: Routes = [
  {
    path: '',
    component: TerminalSwitchFailedLogComponent,
    children: [
      {
        path: '',
        component: TerminalSwitchFailedLogsListingComponent,
      },
      {
        path: ':failedLogId',
        component: TerminalSwitchFailedLogsDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalSwitchFailedLogsRoutingModule {}
