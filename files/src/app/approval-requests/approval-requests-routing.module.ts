import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {ApprovalRequestsDetailsComponent} from './pages/approval-requests-details.component';
import {ApprovalRequestsListingComponent} from './pages/approval-requests-listing.component';
import * as pdbRoles from '../../shared/helpers/pdb.roles.type';
const routes: Routes = [
  {
    path: 'approval-requests',
    component: ApprovalRequestsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [pdbRoles.approvalRequestRole.menu],
    },
  },
  {
    path: 'approval-requests/:id',
    component: ApprovalRequestsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [pdbRoles.approvalRequestRole.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalRequestsRoutingModule {}
