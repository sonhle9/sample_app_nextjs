import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import BillingComponent from './page/index.billing';

const routes: Routes = [
  {
    path: '',
    component: BillingComponent,
    children: [
      {
        path: 'billing-plans',
        loadChildren: () =>
          import('../billing-plans/billing-plans.module').then((m) => m.BillingPlansModule),
      },
      // {
      //   path: 'billing-subscriptions',
      //   loadChildren: () =>
      //     import('../billing-subscriptions/billing-subscriptions.module').then(
      //       (m) => m.BillingSubscriptionsModule,
      //     ),
      // },
      {
        path: 'billing-invoices',
        loadChildren: () =>
          import('../billing-invoices/billing-invoices.module').then(
            (m) => m.BillingInvoicesModule,
          ),
      },
      {
        path: 'credit-notes',
        loadChildren: () =>
          import('../billing-credit-notes/billing-credit-notes.module').then(
            (m) => m.BillingCreditNotesModule,
          ),
      },
      {
        path: 'pukal-payment',
        loadChildren: () =>
          import('../billing-pukal-payment/billing-pukal-payment.module').then(
            (m) => m.BillingPukalPaymentModule,
          ),
      },
      {
        path: 'pukal-sedut',
        loadChildren: () =>
          import('../billing-pukal-sedut/billing-pukal-sedut.module').then(
            (m) => m.BillingPukalSedutModule,
          ),
      },
      {
        path: 'statement-summary',
        loadChildren: () =>
          import('../billing-summary/billing-summary.module').then(
            (m) => m.BillingStatementSummaryModule,
          ),
      },
      {
        path: 'statement-account',
        loadChildren: () =>
          import('../billing-summary/billing-statement-account').then(
            (m) => m.BillingStatementAccountModule,
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../billing-reports/billing-reports.module').then((m) => m.BillingReportsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [BillingComponent],
})
export class BillingModule {}
