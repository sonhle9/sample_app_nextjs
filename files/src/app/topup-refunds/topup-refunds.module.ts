import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {TopupRefundsRoutingModule} from './topup-refunds-routing.module';
import {TopupRefundListComponent} from './pages/topup-refund-list/topup-refund-list.component';
import {TopupRefundDetailsComponent} from './pages/topup-refund-details/topup-refund-details.component';
import {TopupRefundDetailsComponent as NewTopupRefundDetailsComponent} from './pages/topup-refund-details.component';
import {TopupRefundListingComponent} from './pages/topup-refund-listing.component';

@NgModule({
  declarations: [
    TopupRefundListComponent,
    TopupRefundDetailsComponent,
    NewTopupRefundDetailsComponent,
    TopupRefundListingComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    TopupRefundsRoutingModule,
    NgxJsonViewerModule,
  ],
})
export class TopupRefundsModule {}
