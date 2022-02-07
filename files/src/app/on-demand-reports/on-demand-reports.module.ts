import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {OnDemandReportsRoutingModule} from './on-demand-reports-routing-module';
import {OnDemandReportsDetailsComponent} from './pages/on-demand-reports-details.component';
import {OnDemandReportsListingComponent} from './pages/on-demand-reports-listing.component';

@NgModule({
  declarations: [OnDemandReportsListingComponent, OnDemandReportsDetailsComponent],
  imports: [CommonModule, OnDemandReportsRoutingModule, DirectivesModule],
})
export class OnDemandReportsModule {}
