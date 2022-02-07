import {NgModule} from '@angular/core';
import {RebatePlansListingComponent} from './components/rebate-plans-listing.component';
import {RebatePlansRoutingModule} from './rebate-plans-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {RebatePlansDetailComponent} from './components/rebate-plans-detail.component';

@NgModule({
  declarations: [RebatePlansListingComponent, RebatePlansDetailComponent],
  imports: [RebatePlansRoutingModule, ComponentsModule],
})
export class RebatePlansModule {}
