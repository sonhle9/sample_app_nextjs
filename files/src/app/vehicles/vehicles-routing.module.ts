import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {vehicleRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {VehicleDetailsComponent} from './pages/vehicle/vehicle-details.component';
import {VehicleListingComponent} from './pages/vehicle/vehicle-listing.component';
import {VehicleComponent} from './pages/vehicle/vehicle.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [vehicleRole.menu, vehicleRole.index],
    },
    children: [
      {
        path: '',
        component: VehicleListingComponent,
      },
      {
        path: ':id',
        component: VehicleDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleRoutingModule {}
