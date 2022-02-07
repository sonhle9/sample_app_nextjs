import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ledgerRole} from '../../../../shared/helpers/roles.type';
import {AuthResolver} from '../../../auth.guard';
import {FeeSettingsDetailComponent} from './pages/fee-settings-details.component';
import {FeeSettingsListingComponent} from './pages/fee-settings-listing.component';

const routes: Routes = [
  {
    path: '',
    component: FeeSettingsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.read],
    },
  },
  {
    path: ':id',
    component: FeeSettingsDetailComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeeSettingsRoutingModule {}
