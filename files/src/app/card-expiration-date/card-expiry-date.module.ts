import {NgModule} from '@angular/core';
import {CardExpiryDateListComponent} from './pages/card-expiry-date-list/card-expiry-date-list.component';
import {CardExpiryDateDetailsComponent} from './pages/card-expiry-date-details/card-expiry-date-details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared-module.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';
import {CardExpiryDateRoutingModule} from './card-expiry-date-routing.module';
import {CardExpiryDateModalComponent} from './pages/card-expiry-date-modal/card-expiry-date-modal.component';

@NgModule({
  declarations: [
    CardExpiryDateModalComponent,
    CardExpiryDateListComponent,
    CardExpiryDateDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    CardExpiryDateRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
  entryComponents: [CardExpiryDateModalComponent],
})
export class CardExpiryDateModule {}
