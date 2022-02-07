import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billsAndReloadsRoles} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../../auth.guard';
import {ReloadTransactionsListingComponent} from './components/reload-transactions-listing.component';

const routes: Routes = [
  {
    path: '',
    component: ReloadTransactionsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billsAndReloadsRoles.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReloadTransactionsRoutingModule {}
