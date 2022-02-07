import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalSwitchHourlyTnxFileDetailComponent} from './components/terminal-switch-hourly-tnx-detail.component';
import {TerminalSwitchCsvReportTabComponent} from './components/terminal-switch-csv-reports-tab.component';
import {TerminalSwitchCsvReportsComponent} from './components/terminal-switch-csv-reports.component';

const routes: Routes = [
  {
    path: '',
    component: TerminalSwitchCsvReportsComponent,
    children: [
      {
        path: '',
        redirectTo: 'hourly-transaction-file',
      },
      {
        path: 'hourly-transaction-file-detail/:id',
        component: TerminalSwitchHourlyTnxFileDetailComponent,
      },
      {
        path: ':tab',
        component: TerminalSwitchCsvReportTabComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalSwitchHourlyTnxFileRouter {}
