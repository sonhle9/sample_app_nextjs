import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import WalletComponent from './page/index.wallet';

const routes: Routes = [
  {
    path: '',
    component: WalletComponent,
    children: [
      {
        path: 'topup-refunds',
        loadChildren: () =>
          import('../topup-refunds/topup-refunds.module').then((m) => m.TopupRefundsModule),
      },
      {
        path: 'wallet-balance-grantings',
        loadChildren: () =>
          import('../balance-batch-upload/balance-batch-upload.module').then(
            (m) => m.BalanceBatchUploadModule,
          ),
      },
      {
        path: 'topups',
        loadChildren: () => import('../topups/topups.module').then((m) => m.TopupsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [WalletComponent],
})
export class WalletModule {}
