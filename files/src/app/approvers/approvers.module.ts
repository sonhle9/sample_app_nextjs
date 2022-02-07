import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApproversRoutingModule} from './approvers-routing.module';
import {ApproverListingComponent} from './pages/approver-listing.component';
import {ApproverDetailsComponent} from './pages/approver-details.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [ApproverListingComponent, ApproverDetailsComponent],
  imports: [CommonModule, ComponentsModule, ApproversRoutingModule],
})
export class ApproversModule {}
