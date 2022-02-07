import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {loyaltyRoles} from 'src/shared/helpers/roles.type';
import {PointRulesRouteComponent} from './pages/loyalty-point-rules/point-rules-route-component';
import {PointRedemptionRulesComponent} from './pages/loyalty-point-rules/point-redemption-rules';
import {PointRedemptionRuleDetailsComponent} from './pages/loyalty-point-rules/point-redemption-rule-details';
import {PointEarningRulesComponent} from './pages/loyalty-point-rules/point-earning-rules';
import {PointEarningRuleDetailsComponent} from './pages/loyalty-point-rules/point-earning-rule-details';
import {LoyaltyMembersRouteComponent} from './pages/loyalty-members/loyalty-members-route-component';
import {LoyaltyMembersComponent} from './pages/loyalty-members/loyalty-members';
import {LoyaltyMemberDetailsComponent} from './pages/loyalty-members/loyalty-member-details';
import {LoyaltyCategoriesRouteComponent} from './pages/loyalty-categories/loyalty-categories-route-component';
import {LoyaltyCategoriesComponent} from './pages/loyalty-categories/loyalty-categories';
import {LoyaltyCategoryDetailsComponent} from './pages/loyalty-categories/loyalty-category-details';
import {LoyaltyMemberTransactionDetailsComponent} from './pages/loyalty-members/loyalty-member-transaction-details';
import {LoyaltyPointEarningsComponent} from './pages/loyalty-point-earnings/loyalty-point-earnings';
import {LoyaltyPointRedemptionsComponent} from './pages/loyalty-point-redemptions/loyalty-point-redemptions';
import {LoyaltyPointsApprovalComponent} from './pages/loyalty-points-approval/loyalty-points-approval';
import {LoyaltyPointsApprovalRouteComponent} from './pages/loyalty-points-approval/loyalty-points-approval-route-component';
import {LoyaltyPointsApprovalDetailsComponent} from './pages/loyalty-points-approval/loyalty-points-approval-details';
import {LoyaltyPointExpiriesComponent} from './pages/loyalty-point-expiries/loyalty-point-expiries';
import {LoyaltyReportsRouteComponent} from './pages/loyalty-reports/loyalty-reports-route-component';
import {LoyaltyReportsComponent} from './pages/loyalty-reports/loyalty-reports';
import {LoyaltyReportDetailsComponent} from './pages/loyalty-reports/loyalty-report-details';

const routes: Routes = [
  {
    path: 'point-redemption-rules',
    component: PointRulesRouteComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.viewRedemptionRules, loyaltyRoles.adminAccess],
    },
    children: [
      {
        path: '',
        component: PointRedemptionRulesComponent,
      },
      {
        path: ':id',
        component: PointRedemptionRuleDetailsComponent,
      },
    ],
  },
  {
    path: 'point-earning-rules',
    component: PointRulesRouteComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.viewEarningRules, loyaltyRoles.adminAccess],
    },
    children: [
      {
        path: '',
        component: PointEarningRulesComponent,
      },
      {
        path: ':id',
        component: PointEarningRuleDetailsComponent,
      },
    ],
  },
  {
    path: 'members',
    component: LoyaltyMembersRouteComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.loyaltyMembersAdminAccess],
    },
    children: [
      {
        path: '',
        component: LoyaltyMembersComponent,
      },
      {
        path: ':id',
        component: LoyaltyMemberDetailsComponent,
      },
      {
        path: 'transaction/:id',
        component: LoyaltyMemberTransactionDetailsComponent,
      },
    ],
  },
  {
    path: 'loyalty-cards',
    component: LoyaltyMembersRouteComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.loyaltyMembersAdminAccess],
    },
    children: [
      {
        path: ':cardNumber',
        component: LoyaltyMemberDetailsComponent,
      },
    ],
  },
  {
    path: 'loyalty-categories',
    component: LoyaltyCategoriesRouteComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.viewLoyaltyCategories, loyaltyRoles.adminAccess],
    },
    children: [
      {
        path: '',
        component: LoyaltyCategoriesComponent,
      },
      {
        path: ':id',
        component: LoyaltyCategoryDetailsComponent,
      },
    ],
  },
  {
    path: 'point-earnings',
    component: LoyaltyPointEarningsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.viewPointTransactions, loyaltyRoles.adminAccess],
    },
  },
  {
    path: 'point-redemptions',
    component: LoyaltyPointRedemptionsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.viewPointTransactions, loyaltyRoles.adminAccess],
    },
  },
  {
    path: 'point-approval',
    component: LoyaltyPointsApprovalRouteComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.viewPointAdjustment, loyaltyRoles.adminAccess],
    },
    children: [
      {path: '', component: LoyaltyPointsApprovalComponent},
      {path: ':id', component: LoyaltyPointsApprovalDetailsComponent},
    ],
  },
  {
    path: 'point-expiries',
    component: LoyaltyPointExpiriesComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.viewPointExpiries, loyaltyRoles.adminAccess],
    },
  },
  {
    path: 'reports',
    component: LoyaltyReportsRouteComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.viewLoyaltyReports, loyaltyRoles.adminAccess],
    },
    children: [
      {
        path: '',
        component: LoyaltyReportsComponent,
      },
      {
        path: ':id',
        component: LoyaltyReportDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoyaltyRoutingModule {}
