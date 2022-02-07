import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {CustomersComponent} from './pages/customers/customers.component';

import {CustomerDetailsComponent} from './pages/customerDetails/customerDetails';
import {adminAccountRole, customerRole} from 'src/shared/helpers/roles.type';
import {CustomerLoyaltyCardDetailsComponent} from './pages/customerLoyaltyCardDetails/customerLoyaltyCardDetails';
import {CustomerCardDetailsComponent} from './pages/customer-card-details/customer-card-details';
import {GoalDetailsComponent} from './pages/goal-details/goal-details';

const routes: Routes = [
  {
    path: 'loyalty-cards/:id',
    component: CustomerLoyaltyCardDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [customerRole.menu, customerRole.read],
    },
  },
  {
    path: ':id',
    component: CustomerDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        customerRole.menu,
        customerRole.edit,
        customerRole.read,
        customerRole.transactions,
        customerRole.budget,
        customerRole.statement,
        adminAccountRole.adminRead,
      ],
    },
  },
  {
    path: ':id/cards/:cardId',
    component: CustomerCardDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [customerRole.readCard],
    },
  },
  {
    path: '',
    component: CustomersComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        customerRole.menu,
        customerRole.index,
        customerRole.search,
        adminAccountRole.adminRead,
      ],
    },
  },
  {
    path: 'goals/:goalId',
    component: GoalDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [customerRole.menu, customerRole.read],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
