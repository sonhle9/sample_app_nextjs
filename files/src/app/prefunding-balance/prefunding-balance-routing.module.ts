import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {prefundingBalanceRole} from 'src/shared/helpers/roles.type';
import {PrefundingBalanceComponent} from './pages/prefunding-balance/prefunding-balance.component';

const routes: Routes = [
  {
    path: '',
    component: PrefundingBalanceComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [prefundingBalanceRole.viewSummary],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrefundingBalanceRoutingModule {}
