import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
const routes: Routes = [
  {
    path: 'cashflows',
    loadChildren: () => import('./pages/cashflows/cashflows.module').then((m) => m.CashflowsModule),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LedgerRoutingModule {}
