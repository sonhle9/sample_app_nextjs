import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {EditStationDetailsComponent} from './pages/editStationDetails/editStationDetails';
import {StationDetailsMapComponent} from './pages/station-details-map/station-details-map.component';
import {StationDetailsBetaComponent} from './pages/station-details/station-details-beta.component';
import {StationDetailsComponent} from './pages/station-details/station-details.component';
import {StationInCarOrdersComponent} from './pages/station-in-car-orders/station-in-car-orders.component';
import {StationListingComponent} from './pages/station-listing.component';
import {StationOrdersComponent} from './pages/station-orders/station-orders.component';
import {StationStoreOrdersComponent} from './pages/station-store-orders/station-store-orders.component';
import {StationsComponent} from './pages/stations/stations';

const routes: Routes = [
  {
    path: '',
    component: StationListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.stationView],
    },
  },
  {
    path: 'list',
    component: StationListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.stationView],
    },
  },
  {
    path: ':id',
    component: StationsComponent,
    canActivate: [AuthResolver],
    children: [
      {path: 'details', component: StationDetailsComponent},
      {path: 'details(beta)', component: StationDetailsBetaComponent},
      {path: 'orders', component: StationOrdersComponent},
      {path: 'deliver2me', component: StationInCarOrdersComponent},
      {path: 'over-counter', component: StationStoreOrdersComponent},
      {path: 'map', component: StationDetailsMapComponent},
    ],
    data: {
      roles: [retailRoles.stationView],
    },
  },
  {
    path: ':id/edit',
    component: EditStationDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.stationUpdate],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StationsRoutingModule {}
