import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {BNPLPlanListingComponent} from './pages/plan-listing.component';
import {BNPLAccountListingComponent} from './pages/account-listing.component';
import {BNPLBillListingComponent} from './pages/bill-listing.component';
import {BNPLInstructionListingComponent} from './pages/instruction-listing.component';
import {PlanDetailsComponent} from './pages/plan-details.component';
import {BNPLAccountDetailsComponent} from './pages/account-details.component';
import {
  adminBnplPlanConfig,
  adminBnplAccount,
  adminBnplBill,
  adminBnplInstruction,
} from 'src/shared/helpers/roles.type';

const routes: Routes = [
  {
    path: 'plans',
    component: BNPLPlanListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminBnplPlanConfig.adminView],
    },
  },
  {
    path: 'plans/details/:id',
    component: PlanDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminBnplPlanConfig.adminView],
    },
  },
  {
    path: 'accounts',
    component: BNPLAccountListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminBnplAccount.adminView],
    },
  },
  {
    path: 'accounts/details/:id',
    redirectTo: 'accounts/details/:id/general',
  },
  {
    path: 'accounts/details/:id/:tab',
    component: BNPLAccountDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminBnplAccount.adminView],
    },
  },
  {
    path: 'instructions',
    component: BNPLInstructionListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminBnplInstruction.adminView],
    },
  },
  {
    path: 'bills',
    component: BNPLBillListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminBnplBill.adminView],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyNowPayLaterRoutingModule {}
