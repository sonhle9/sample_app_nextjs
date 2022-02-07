import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ParkingSessionsRouteComponent} from './pages/sessions/parking-sessions-route-component';
import {ParkingSessionsComponent} from './pages/sessions/parking-sessions';
import {ParkingSessionDetailsComponent} from './pages/sessions/parking-sessions-details';
import {ParkingLocationsRouteComponent} from './pages/locations/parking-locations-route-component';

const routes: Routes = [
  {
    path: 'sessions',
    component: ParkingSessionsRouteComponent,
    children: [
      {path: '', component: ParkingSessionsComponent},
      {path: ':id', component: ParkingSessionDetailsComponent},
    ],
  },
  {
    path: 'locations',
    component: ParkingLocationsRouteComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParkingAffiliateRoutingModule {}
