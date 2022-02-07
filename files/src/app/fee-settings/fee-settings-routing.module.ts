import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {FeeSettingsListingComponent} from './components/fee-settings-listing.component';
import {feeSettingsRole} from 'src/shared/helpers/roles.type';
import {FeeSettingDetailsComponent} from './components/fee-settings-detail.component';

const routes: Routes = [
  {
    path: '',
    component: FeeSettingsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [feeSettingsRole.view],
    },
  },
  {
    path: ':id',
    component: FeeSettingDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [feeSettingsRole.modify],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeeSettingsRoutingModule {}
