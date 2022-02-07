import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {OrdersComponent} from './pages/orders/orders';
import {retailRoles} from '../../shared/helpers/roles.type';
import {FuelOrdersReportsDownloadComponent} from './pages/orders-reports-download.component';
import {OrderDetailsComponent} from './pages/orderDetails/orderDetails';

const routes: Routes = [
  {
    path: ':id',
    component: OrderDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.fuelOrderView],
    },
  },
  {
    path: '',
    component: OrdersComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.fuelOrderView],
    },
  },
  {
    path: 'report/download',
    canActivate: [AuthResolver],
    component: FuelOrdersReportsDownloadComponent,
    data: {
      roles: [retailRoles.fuelOrderView],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
