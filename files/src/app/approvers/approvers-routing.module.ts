import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {ApproverDetailsComponent} from './pages/approver-details.component';
import {ApproverListingComponent} from './pages/approver-listing.component';
import * as pdbRoles from '../../shared/helpers/pdb.roles.type';

const routes: Routes = [
  {
    path: 'approvers',
    component: ApproverListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [pdbRoles.approverRole.menu],
    },
  },
  {
    path: 'approvers/:id',
    component: ApproverDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        pdbRoles.approverRole.menu,
        pdbRoles.approverRole.create,
        pdbRoles.approverRole.update,
        pdbRoles.approverRole.delete,
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApproversRoutingModule {}
