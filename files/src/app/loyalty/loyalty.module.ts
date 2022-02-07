import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CommonModule} from '@angular/common';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgModule} from '@angular/core';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MaterialModule} from 'src/shared/material/material.module';
import {LoyaltyRoutingModule} from './loyalty-routing.module';
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
import {LoyaltyPointEarningsComponent} from './pages/loyalty-point-earnings/loyalty-point-earnings';
import {LoyaltyPointRedemptionsComponent} from './pages/loyalty-point-redemptions/loyalty-point-redemptions';
import {LoyaltyMemberTransactionDetailsComponent} from './pages/loyalty-members/loyalty-member-transaction-details';
import {LoyaltyPointsApprovalComponent} from './pages/loyalty-points-approval/loyalty-points-approval';
import {LoyaltyPointsApprovalDetailsComponent} from './pages/loyalty-points-approval/loyalty-points-approval-details';
import {LoyaltyPointsApprovalRouteComponent} from './pages/loyalty-points-approval/loyalty-points-approval-route-component';
import {LoyaltyPointExpiriesComponent} from './pages/loyalty-point-expiries/loyalty-point-expiries';
import {LoyaltyReportsRouteComponent} from './pages/loyalty-reports/loyalty-reports-route-component';
import {LoyaltyReportsComponent} from './pages/loyalty-reports/loyalty-reports';
import {LoyaltyReportDetailsComponent} from './pages/loyalty-reports/loyalty-report-details';

@NgModule({
  declarations: [
    PointRulesRouteComponent,
    PointRedemptionRulesComponent,
    PointRedemptionRuleDetailsComponent,
    PointEarningRulesComponent,
    PointEarningRuleDetailsComponent,
    LoyaltyMembersRouteComponent,
    LoyaltyMembersComponent,
    LoyaltyMemberDetailsComponent,
    LoyaltyCategoriesRouteComponent,
    LoyaltyCategoriesComponent,
    LoyaltyCategoryDetailsComponent,
    LoyaltyMemberTransactionDetailsComponent,
    LoyaltyPointEarningsComponent,
    LoyaltyPointRedemptionsComponent,
    LoyaltyPointsApprovalComponent,
    LoyaltyPointExpiriesComponent,
    LoyaltyReportsRouteComponent,
    LoyaltyReportsComponent,
    LoyaltyReportDetailsComponent,
    LoyaltyPointsApprovalRouteComponent,
    LoyaltyPointsApprovalDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    LoyaltyRoutingModule,
    NgxJsonViewerModule,
    MaterialModule,
  ],
})
export class LoyaltyModule {}
