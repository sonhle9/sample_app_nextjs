import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {GeneralLedgerParameterDetailsComponent} from './pages/general-ledger-parameter-details.component';
import {GeneralLedgerParameterListingComponent} from './pages/general-ledger-parameter-listing.component';
import * as pdbRoles from 'src/shared/helpers/pdb.roles.type';

const routes: Routes = [
  {
    path: '',
    component: GeneralLedgerParameterListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [pdbRoles.generalLedgerAccess.read],
    },
  },
  {
    path: ':id',
    component: GeneralLedgerParameterDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [pdbRoles.generalLedgerAccess.read],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralLedgerRoutingModule {}
