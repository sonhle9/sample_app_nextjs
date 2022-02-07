import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {RefundsRoutingModule} from './refunds-routing.module';
import {RefundListComponent} from './pages/refund-list/refund-list.component';
import {PaymentsRefundsListingComponent} from './pages/payments-refunds-listing.component';

@NgModule({
  declarations: [RefundListComponent, PaymentsRefundsListingComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    RefundsRoutingModule,
    NgxJsonViewerModule,
  ],
  exports: [],
})
export class RefundsModule {}
