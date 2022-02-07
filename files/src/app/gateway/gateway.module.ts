import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import GatewayComponent from './page/index.gateway';

const routes: Routes = [
  {
    path: '',
    component: GatewayComponent,
    children: [
      {
        path: 'reconciliations',
        loadChildren: () =>
          import('../reconciliations/reconciliations.module').then((m) => m.ReconciliationsModule),
      },
      {
        path: 'exceptions',
        loadChildren: () =>
          import('../exceptions/exceptions.module').then((m) => m.ExceptionsModule),
      },
      {
        path: 'terminals',
        loadChildren: () => import('../terminals/terminals.module').then((m) => m.TerminalsModule),
      },
      {
        path: 'setel-terminals',
        loadChildren: () =>
          import('../setel-terminals/setel-terminals.module').then((m) => m.SetelTerminalsModule),
      },
      {
        path: 'failed-logs',
        loadChildren: () =>
          import('../terminal-switch-failed-logs/terminal-switch-failed-log-listing.module').then(
            (m) => m.TerminalSwitchFailedLogsModule,
          ),
      },
      {
        path: 'batches',
        loadChildren: () =>
          import('../terminal-switch-batches/terminals-switch-batches.modules').then(
            (m) => m.TerminalSwitchBatches,
          ),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('../terminal-switch-transactions/terminal-switch-transactions.module').then(
            (m) => m.TerminalSwitchTransactionModule,
          ),
      },
      {
        path: 'monthly-card-sales-report',
        loadChildren: () =>
          import(
            '../terminal-switch-monthly-card-sales-report/terminal-switch-monthly-card-sales-report.module'
          ).then((m) => m.TerminalSwitchMonthlyCardSalesReportModule),
      },
      {
        path: 'csv-reports',
        loadChildren: () =>
          import('../terminal-switch-csv-reports/terminal-switch-csv-reports.module').then(
            (m) => m.TerminalSwitchCsvReportsModule,
          ),
      },
      {
        path: 'force-close-approval',
        loadChildren: () =>
          import(
            '../terminal-switch-force-close-approval/terminal-switch-force-close-approval.modules'
          ).then((m) => m.TerminalSwitchForceCloseApproval),
      },
      {
        path: 'transaction-and-batch-summary-report',
        loadChildren: () =>
          import(
            '../terminal-switch-tx-n-batch-summary/terminal-switch-tx-n-batch-summary.module'
          ).then((m) => m.TerminalSwitchTxNBatchSummaryModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [GatewayComponent],
})
export class GatewayModule {}
