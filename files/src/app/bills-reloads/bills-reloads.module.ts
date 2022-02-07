import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import BillsReloadsComponent from './components/bills-reloads.component';

const routes: Routes = [
  {
    path: '',
    component: BillsReloadsComponent,
    children: [
      {
        path: 'reload-transactions',
        loadChildren: () =>
          import('./reload-transactions/reload-transactions.module').then(
            (m) => m.ReloadTransactionsModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [BillsReloadsComponent],
})
export class BillsReloadsModule {}
