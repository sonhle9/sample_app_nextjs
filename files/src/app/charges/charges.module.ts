import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {DirectivesModule} from '../../shared/directives/directives.module';
import {ChargesRoutingModule} from './charges-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {MomentModule} from 'ngx-moment';
import {ChargesComponent} from './pages/charges/charges';
import {PaymentsChargesListingComponent} from './pages/payments-charges-listing.component';
import {NgxJsonViewerModule} from 'ngx-json-viewer';

@NgModule({
  declarations: [ChargesComponent, PaymentsChargesListingComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    ChargesRoutingModule,
    NgxJsonViewerModule,
  ],
})
export class ChargesModule {}
