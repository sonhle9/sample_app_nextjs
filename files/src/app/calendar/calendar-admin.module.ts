import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {CalendarAdminListingComponent} from './pages/calendar-admin-listing.component';
import {CalendarAdminDetailsComponent} from './pages/calendar-admin-details.component';
import {CalendarAdminRoutingModule} from './calendar-admin-routing-module';

@NgModule({
  declarations: [CalendarAdminListingComponent, CalendarAdminDetailsComponent],
  imports: [CommonModule, CalendarAdminRoutingModule, DirectivesModule],
})
export class CalendarAdminModule {}
