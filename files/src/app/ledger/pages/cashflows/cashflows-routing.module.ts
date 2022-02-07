import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from 'src/app/auth.guard';
import {ledgerRole} from 'src/shared/helpers/roles.type';
import {CashflowsComponent} from './components/cashflows.component';

const routes: Routes = [
  {
    path: '',
    component: CashflowsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.read],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashflowsRoutingModule {}
