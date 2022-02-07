import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import PaymentsComponent from './page/index.payments';

const routes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
    children: [
      {
        path: 'transactions',
        loadChildren: () =>
          import('../transactions/transactions.module').then((m) => m.TransactionsModule),
      },
      {
        path: 'charges',
        loadChildren: () => import('../charges/charges.module').then((m) => m.ChargesModule),
      },
      {
        path: 'refunds',
        loadChildren: () => import('../refunds/refunds.module').then((m) => m.RefundsModule),
      },
      {
        path: 'transfers',
        loadChildren: () => import('../transfers/transfers.module').then((m) => m.TransfersModule),
      },
      {
        path: 'settlements',
        loadChildren: () =>
          import('./settlements/settlements.module').then((m) => m.SettlementsModule),
      },
      {
        path: 'adjustments',
        loadChildren: () =>
          import('../adjustments/adjustments.module').then((m) => m.AdjustmentsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [PaymentsComponent],
})
export class PaymentsModule {}
