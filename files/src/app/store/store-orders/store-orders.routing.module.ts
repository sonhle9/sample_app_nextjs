import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../../auth.guard';
import {retailRoles} from '../../../shared/helpers/roles.type';
import {OverCounterOrderDetailsComponent} from './pages/over-counter-order-details/over-counter-order-details.component';
import {Deliver2MeOrderDetailsComponent} from './pages/deliver2me-order-details/deliver2me-order-details.component';
import {StoreOrderListComponent} from './pages/store-order-list/store-order-list.component';

const routes: Routes = [
  {
    path: ':tab',
    component: StoreOrderListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.storeOrderView, retailRoles.storeInCarOrderView],
    },
  },
  {
    path: 'concierge/:id',
    component: Deliver2MeOrderDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.storeInCarOrderView],
    },
  },
  {
    path: 'over-counter/:id',
    component: OverCounterOrderDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.storeOrderView],
    },
  },
  {
    path: '',
    redirectTo: 'over-counter',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreOrdersRoutingModule {}
