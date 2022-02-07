import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AttributionRoutingModule} from './attribution-routing.module';
import {AttributionComponent} from './pages/attribution.component';
import {AttributionDetailsComponent} from './pages/attribution-details.component';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [AttributionComponent, AttributionDetailsComponent],
  imports: [CommonModule, AttributionRoutingModule, DirectivesModule, ComponentsModule],
})
export class AttributionModule {}
