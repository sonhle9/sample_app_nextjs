import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApprovalRulesRoutingModule} from './approval-rules-routing.module';
import {ApprovalRulesListingComponent} from './pages/approval-rules-listing.component';
import {ApprovalRuleDetailsComponent} from './pages/approval-rule-details.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [ApprovalRulesListingComponent, ApprovalRuleDetailsComponent],
  imports: [CommonModule, ComponentsModule, ApprovalRulesRoutingModule],
})
export class ApprovalRulesModule {}
