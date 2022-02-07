import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {GeneralLedgerRectificationDetailsComponent} from './pages/general-ledger-rectification-details.component';
import {GeneralLedgerRectificationListingComponent} from './pages/general-ledger-rectification-listing.component';
import * as pdbRoles from 'src/shared/helpers/pdb.roles.type';

const routes: Routes = [
  {
    path: '',
    component: GeneralLedgerRectificationListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [pdbRoles.generalLedgerAccess.read],
    },
  },
  {
    path: ':id',
    component: GeneralLedgerRectificationDetailsComponent,
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
