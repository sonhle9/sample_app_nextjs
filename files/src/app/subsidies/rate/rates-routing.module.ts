import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {subsidyRateRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../../auth.guard';
import {SubsidyRatesComponent} from './components/rates.component';

const routes: Routes = [
  {
    path: '',
    component: SubsidyRatesComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [subsidyRateRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubsidyRateRoutingModule {}
