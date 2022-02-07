import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {subsidyMaintenanceRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../../auth.guard';
import {SubsidiesMaintenancesComponent} from './components/maintenances.component';

const routes: Routes = [
  {
    path: '',
    component: SubsidiesMaintenancesComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [subsidyMaintenanceRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubsidyMaintenanceRoutingModule {}
