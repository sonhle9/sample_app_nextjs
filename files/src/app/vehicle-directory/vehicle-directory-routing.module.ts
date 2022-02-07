import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {vehicleRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {VehicleBrandListingComponent} from './pages/brand/brand-listing.component';
import {VehicleDirectoryComponent} from './vehicle-directory.component';
import {VehicleModelListingComponent} from './pages/model/model-listing.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleDirectoryComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [vehicleRole.menu, vehicleRole.index],
    },
    children: [
      {
        path: '',
        component: VehicleBrandListingComponent,
      },
      {
        path: 'models/:brandId',
        component: VehicleModelListingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleDirectoryRoutingModule {}
