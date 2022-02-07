import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthResolver} from '../auth.guard';
import {DeviceViewComponent} from './pages/device-view/device-view.component';
import {DeviceListComponent} from './pages/device-list/device-list.component';
import {deviceRole} from '../../shared/helpers/roles.type';
import {DeviceDetailsComponent} from './pages/device-details/device-details.component';
import {DeviceListingComponent} from './pages/device-listing.component';
import {DeviceDetailsComponent as NewDeviceDetailsComponent} from './pages/device-details.component';

// TODO: check role
const routes: Routes = [
  {
    path: '',
    component: DeviceViewComponent,
    canActivate: [AuthResolver],
    children: [{path: 'list', component: DeviceListComponent}],
    data: {
      roles: [deviceRole.view],
    },
  },
  {
    path: 'listing',
    component: DeviceListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [deviceRole.view],
    },
  },
  {
    path: 'details/:id',
    component: NewDeviceDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [deviceRole.view],
    },
  },
  {
    path: ':id',
    component: DeviceDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [deviceRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule {}
