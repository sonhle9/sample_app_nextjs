import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
// import {AuthResolver} from '../auth.guard';
import {OutageComponent} from './pages/outage/outage.component';
import {OutageComponent as Outage} from './components/outage.component';
// import {orderRole} from 'src/shared/helpers/roles.type';

const routes: Routes = [
  // {
  //   path: ':id',
  //   component: OutageComponent,
  //   // canActivate: [AuthResolver],
  //   // data: {
  //   //   roles: [orderRole.menu, orderRole.read],
  //   // },
  // },
  {
    path: '',
    component: OutageComponent,
    // canActivate: [AuthResolver],
    // data: {
    //   roles: [orderRole.menu, orderRole.index, orderRole.search],
    // },
  },
  {
    path: 'new',
    component: Outage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutageRoutingModule {}
