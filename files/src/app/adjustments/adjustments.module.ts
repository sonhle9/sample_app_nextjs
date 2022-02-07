import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {AdjustmentsRoutingModule} from './adjustments-routing.module';
import {MerchantAdjustmentListComponent} from './pages/merchant-adjustment-list/merchant-adjustment-list.component';
import {MerchantAdjustmentDetailsComponent} from './pages/merchant-adjustment-details/merchant-adjustment-details.component';
import {AdjustmentViewComponent} from './pages/adjustment-view/adjustment-view.component';
import {CustomerAdjustmentListComponent} from './pages/customer-adjustment-list/customer-adjustment-list.component';
import {CustomerAdjustmentDetailsComponent} from './pages/customer-adjustment-details/customer-adjustment-details.component';
import {PaymentsAdjustmentsListingComponent} from './pages/payments-adjustments-listing.component';
import {PaymentsCustomerAdjustmentDetailsComponent} from './pages/payments-customer-adjustment-details.component';
import {PaymentsMerchantAdjustmentDetailsComponent} from './pages/payments-merchant-adjustment-details.component';

@NgModule({
  declarations: [
    MerchantAdjustmentListComponent,
    MerchantAdjustmentDetailsComponent,
    AdjustmentViewComponent,
    CustomerAdjustmentListComponent,
    CustomerAdjustmentDetailsComponent,
    PaymentsAdjustmentsListingComponent,
    PaymentsCustomerAdjustmentDetailsComponent,
    PaymentsMerchantAdjustmentDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    AdjustmentsRoutingModule,
    NgxJsonViewerModule,
  ],
})
export class AdjustmentsModule {}
