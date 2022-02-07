import {NgModule} from '@angular/core';
import {SettlementsComponent} from './components/settlements.component';
import {SettlementsListingComponent} from './components/settlements-listing.component';
import {SettlementsRoutingModule} from './settlements-routing.module';
import {ComponentsModule} from '../../../shared/components/components.module';

@NgModule({
  declarations: [SettlementsComponent, SettlementsListingComponent],
  imports: [SettlementsRoutingModule, ComponentsModule],
})
export class SettlementsModule {}
