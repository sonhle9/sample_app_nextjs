import {PipesModule} from 'src/shared/pipes/pipes.module';
import {SessionsComponent} from './sessions/sessions';
import {DirectivesModule} from './../../shared/directives/directives.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckoutRoutingModule} from './checkout-routing.module';
import {ComponentsModule} from 'src/shared/components/components.module';
import CheckoutComponent from './page/index.checkout';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {PaymentProcessorTransactionComponent} from './payment-processor-transaction/paymentProcessorTransaction';

@NgModule({
  declarations: [CheckoutComponent, SessionsComponent, PaymentProcessorTransactionComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    MomentModule,
    NgxJsonViewerModule,
  ],
})
export class CheckoutModule {}
