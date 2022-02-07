import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {DevicesComponent} from './pages/devices/devices.component';
import {DeviceDetailsComponent} from './pages/deviceDetails/deviceDetails.component';
import {FraudProfileListComponent} from './pages/fraud-profile-list/fraudProfileList.component';
import {FraudProfileDetailsComponent} from './pages/fraud-profile-details/fraudProfileDetails.component';
import {adminFraudProfile, adminRiskProfile} from 'src/shared/helpers/roles.type';
import {FraudProfileDetailsComponent as NewFraudProfileDetailsComponent} from './pages/fraud-profile-details.component';
import {FraudProfileListingComponent} from './pages/fraud-profile-listing.component';
import {AccountDevicesComponent} from './components/account-devices.component';
import {AccountDeviceDetailsComponent} from './components/account-device-details.component';
import {RiskProfileListingComponent} from './pages/risk-profile-listing.component';
import {RiskProfileDetailsComponent} from './pages/risk-profile-details.component';

const routes: Routes = [
  {
    path: 'fraud-profiles',
    component: FraudProfileListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        adminFraudProfile.adminView,
        adminFraudProfile.adminSearch,
        adminFraudProfile.adminUpdate,
      ],
    },
  },
  {
    path: 'fraud-profiles/listing',
    component: FraudProfileListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        adminFraudProfile.adminView,
        adminFraudProfile.adminSearch,
        adminFraudProfile.adminUpdate,
      ],
    },
  },
  {
    path: 'fraud-profiles/details/:id',
    component: NewFraudProfileDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        adminFraudProfile.adminView,
        adminFraudProfile.adminSearch,
        adminFraudProfile.adminUpdate,
      ],
    },
  },
  {
    path: 'fraud-profiles/:id',
    component: FraudProfileDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        adminFraudProfile.adminView,
        adminFraudProfile.adminSearch,
        adminFraudProfile.adminUpdate,
      ],
    },
  },
  {
    path: 'account-devices',
    component: DevicesComponent,
  },
  {
    path: 'account-devices/listing',
    component: AccountDevicesComponent,
  },
  {
    path: 'account-devices/:id',
    component: DeviceDetailsComponent,
  },
  {
    path: 'account-devices/listing/:id',
    component: AccountDeviceDetailsComponent,
  },
  {
    path: 'risk-profiles/listing',
    component: RiskProfileListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        adminRiskProfile.adminView,
        adminRiskProfile.adminSearch,
        adminRiskProfile.adminIndex,
      ],
    },
  },
  {
    path: 'risk-profiles/details/:id',
    component: RiskProfileDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        adminRiskProfile.adminView,
        adminRiskProfile.adminSearch,
        adminRiskProfile.adminIndex,
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FraudProfileRoutingModule {}
