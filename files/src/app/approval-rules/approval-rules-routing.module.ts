import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {ApprovalRuleDetailsComponent} from './pages/approval-rule-details.component';
import {ApprovalRulesListingComponent} from './pages/approval-rules-listing.component';
import * as pdbRoles from '../../shared/helpers/pdb.roles.type';

const routes: Routes = [
  {
    path: 'approval-rules',
    canActivate: [AuthResolver],
    component: ApprovalRulesListingComponent,
    data: {
      roles: [pdbRoles.approvalRuleRole.menu],
    },
  },
  {
    path: 'approval-rules/:id',
    canActivate: [AuthResolver],
    component: ApprovalRuleDetailsComponent,
    data: {
      roles: [
        pdbRoles.approvalRuleRole.menu,
        pdbRoles.approvalRuleRole.create,
        pdbRoles.approvalRuleRole.update,
        pdbRoles.approvalRuleRole.delete,
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalRulesRoutingModule {}
