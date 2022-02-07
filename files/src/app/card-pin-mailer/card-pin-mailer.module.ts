import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CardPinMailerRoutingModule} from './card-pin-mailer-routing.module';
import {CardPinMailerListComponent} from './card-pin-mailer-list.component';
import {CardPinMailerDetailsComponent} from './card-pin-mailer-details.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [CardPinMailerListComponent, CardPinMailerDetailsComponent],
  imports: [CommonModule, ComponentsModule, CardPinMailerRoutingModule],
})
export class CardPinMailerModule {}
