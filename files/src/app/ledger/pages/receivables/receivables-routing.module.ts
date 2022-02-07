import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {ledgerRole} from '../../../../shared/helpers/roles.type';
import {AuthResolver} from '../../../auth.guard';
import {ReceivablesDetailsComponent} from './pages/receivables-details.component';
import {LegacyReceivablesDetailsComponent} from './pages/receivables-details/receivables-details';
import {ReceivablesListingComponent} from './pages/receivables-listing.component';
import {LegacyReceivablesComponent} from './pages/receivables/receivables';

const routes: Routes = [
  {
    path: ':id',
    component: environment.useLegacyTreasury?.receivables
      ? LegacyReceivablesDetailsComponent
      : ReceivablesDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.read],
    },
  },
  {
    path: '',
    component: environment.useLegacyTreasury?.receivables
      ? LegacyReceivablesComponent
      : ReceivablesListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivablesRoutingModule {}
