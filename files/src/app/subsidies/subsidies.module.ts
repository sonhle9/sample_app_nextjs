import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import SubsidiesComponent from './page/index.subsidies';

const routes: Routes = [
  {
    path: '',
    component: SubsidiesComponent,
    children: [
      {
        path: 'subsidy-maintenance',
        loadChildren: () =>
          import('./maintenance/maintenances.module').then((m) => m.MaintenancesModule),
      },
      {
        path: 'subsidy-rates',
        loadChildren: () => import('./rate/rates.module').then((m) => m.RatesModule),
      },
      {
        path: 'subsidy-claim-files',
        loadChildren: () =>
          import('./claim-files/claim-files.module').then((m) => m.ClaimFilesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [SubsidiesComponent],
})
export class SubsidiesModule {}
