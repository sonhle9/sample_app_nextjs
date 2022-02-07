import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {calendarAdminRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {CalendarAdminDetailsComponent} from './pages/calendar-admin-details.component';
import {CalendarAdminListingComponent} from './pages/calendar-admin-listing.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarAdminListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [calendarAdminRole.access, calendarAdminRole.operations],
    },
  },
  {
    path: ':id',
    component: CalendarAdminDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [calendarAdminRole.access, calendarAdminRole.operations],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarAdminRoutingModule {}
