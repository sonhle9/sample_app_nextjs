import {NgModule} from '@angular/core';
import {FeePlansListingComponent} from './components/fee-plans-listing.component';
import {FeePlansRoutingModule} from './fee-plans-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {FeePlansDetailComponent} from './components/fee-plans-detail.component';

@NgModule({
  declarations: [FeePlansListingComponent, FeePlansDetailComponent],
  imports: [FeePlansRoutingModule, ComponentsModule],
})
export class FeePlansModule {}
