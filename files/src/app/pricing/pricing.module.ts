import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import PricingComponent from './page/index.pricing';

const routes: Routes = [
  {
    path: '',
    component: PricingComponent,
    children: [
      {
        path: 'fee-plans',
        loadChildren: () => import('../fee-plans/fee-plans.module').then((m) => m.FeePlansModule),
      },
      {
        path: 'collections',
        loadChildren: () =>
          import('../collections/collections.module').then((m) => m.CollectionsModule),
      },
      {
        path: 'fees',
        loadChildren: () => import('../fees/fees.module').then((m) => m.FeesModule),
      },
      {
        path: 'rebate-plans',
        loadChildren: () =>
          import('../rebate-plans/rebate-plans.module').then((m) => m.RebatePlansModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('../rebate-reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'fee-settings',
        loadChildren: () =>
          import('../fee-settings/fee-settings.module').then((m) => m.FeeSettingsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [PricingComponent],
})
export class PricingModule {}
