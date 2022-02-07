import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApprovalRequestsRoutingModule} from './approval-requests-routing.module';
import {ApprovalRequestsListingComponent} from './pages/approval-requests-listing.component';
import {ApprovalRequestsDetailsComponent} from './pages/approval-requests-details.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [ApprovalRequestsListingComponent, ApprovalRequestsDetailsComponent],
  imports: [CommonModule, ComponentsModule, ApprovalRequestsRoutingModule],
})
export class ApprovalRequestsModule {}
