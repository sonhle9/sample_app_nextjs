import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GiftCardAgeingRoutingModule} from './gift-card-ageing-routing.module';
import {GiftCardAgeingListComponent} from './gift-card-ageing-list.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [GiftCardAgeingListComponent],
  imports: [CommonModule, ComponentsModule, GiftCardAgeingRoutingModule],
})
export class GiftCardAgeingModule {}
