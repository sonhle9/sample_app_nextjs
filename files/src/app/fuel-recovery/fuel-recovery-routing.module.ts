import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FuelRecoveryPendingListComponent} from './fuel-recovery-pending-list/fuel-recovery-pending-list.component';
import {AuthResolver} from '../auth.guard';
import {retailRoles} from './../../shared/helpers/roles.type';
import {FuelRecoveryViewComponent} from './fuel-recovery-view/fuel-recovery-view.component';
import {FuelRecoveryLostListComponent} from './fuel-recovery-lost-list/fuel-recovery-lost-list.component';

const routes: Routes = [
  {
    path: '',
    component: FuelRecoveryViewComponent,
    canActivate: [AuthResolver],
    children: [
      {path: 'pending', component: FuelRecoveryPendingListComponent},
      {path: 'lost', component: FuelRecoveryLostListComponent},
    ],

    data: {
      roles: [retailRoles.fuelOrderRecoveryView],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuelRecoveryRoutingModule {}
