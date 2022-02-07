import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {MT940ReportsDetailsComponent} from './pages/mt940-reports-details.component';
import {MT940ReportsListingComponent} from './pages/mt940-reports-listing.component';
import {MT940ReportsRoutingModule} from './mt940-reports-routing-module';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [MT940ReportsListingComponent, MT940ReportsDetailsComponent],
  imports: [CommonModule, MT940ReportsRoutingModule, DirectivesModule, ComponentsModule],
})
export class MT940ReportsModule {}
