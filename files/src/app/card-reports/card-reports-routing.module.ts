import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {cardReportAccess} from 'src/shared/helpers/pdb.roles.type';
import {AuthResolver} from '../auth.guard';
import {CardReportsDownloadComponent} from './card-reports-download.component';
import {CardReportsComponent} from './card-reports.component';

const routes: Routes = [
  {
    path: 'reports',
    canActivate: [AuthResolver],
    component: CardReportsComponent,
    data: {
      roles: [cardReportAccess.menu],
    },
  },
  {
    path: 'reports/expired-card-balance-summary',
    loadChildren: () =>
      import('./expired-card-balance-summary/expired-card-balance-summary.module').then(
        (m) => m.ExpiredCardBalanceSummaryModule,
      ),
  },
  {
    path: 'reports/expired-card-balance-details',
    loadChildren: () =>
      import('./expired-card-balance-details/expired-card-balance-details.module').then(
        (m) => m.ExpiredCardBalanceDetailsModule,
      ),
  },
  {
    path: 'reports/gift-card-ageing',
    loadChildren: () =>
      import('./gift-card-ageing/gift-card-ageing.module').then((m) => m.GiftCardAgeingModule),
  },
  {
    path: 'reports/gift-card-summary',
    loadChildren: () =>
      import('./gift-card-summary/gift-card-summary.module').then((m) => m.GiftCardSummaryModule),
  },
  {
    path: 'reports/:url/download',
    canActivate: [AuthResolver],
    component: CardReportsDownloadComponent,
    data: {
      roles: [cardReportAccess.menu],
    },
  },
  {
    path: 'reports/approved-topup-transactions',
    loadChildren: () =>
      import('./approved-topup-transactions/approved-topup-transactions.module').then(
        (m) => m.ApprovedTopupTransactionsModule,
      ),
  },
  {
    path: 'reports/approved-adjustment-transactions',
    loadChildren: () =>
      import('./approved-adjustment-transactions/approved-adjustment-transactions.module').then(
        (m) => m.ApprovedAdjustmentTransactionModule,
      ),
  },
  {
    path: 'reports/gift-card-itemised-transaction',
    loadChildren: () =>
      import('./gift-card-itemised-transaction/gift-card-itemised-transaction.module').then(
        (m) => m.GiftCardItemisedTransactionModule,
      ),
  },
  {
    path: 'reports/gift-card-transactions-summary',
    loadChildren: () =>
      import('./gift-card-transactions-summary/gift-card-transactions-summary.module').then(
        (m) => m.GiftCardTransactionsSummaryModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardReportsRoutingModule {}
