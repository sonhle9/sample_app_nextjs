import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {GeneralLedgerPayoutsDetailsComponent} from './pages/general-ledger-payouts-details.component';
import {GeneralLedgerPayoutsListingComponent} from './pages/general-ledger-payouts-listing.component';
import * as pdbRoles from 'src/shared/helpers/pdb.roles.type';

const routes: Routes = [
  {
    path: '',
    component: GeneralLedgerPayoutsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [pdbRoles.generalLedgerPayoutsAccess.read],
    },
  },
  {
    path: ':id',
    component: GeneralLedgerPayoutsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [pdbRoles.generalLedgerPayoutsAccess.read],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralLedgerPayoutsRoutingModule {}
