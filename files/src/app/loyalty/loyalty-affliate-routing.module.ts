import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {loyaltyRoles} from 'src/shared/helpers/roles.type';
import {LoyaltyCardsComponent} from './pages/loyalty-cards/loyalty-cards';
import {LoyaltyTransactionsComponent} from './pages/loyalty-transactions/loyalty-transactions';
import {TransactionsComponent} from './pages/transactions/transactions';
import {TransactionDetailsComponent} from './pages/transactions/transaction-details';
import {TransactionsRouteComponent} from './pages/transactions/transactions-route-component';
import {LoyaltyDailyComponent} from './pages/loyalty-daily/loyalty-daily';
import {LoyaltyMonthlyComponent} from './pages/loyalty-monthly/loyalty-monthly';
import {SearchLoyaltyCardsComponent} from './pages/search-loyalty-cards/search-loyalty-cards.component';

const routes: Routes = [
  {
    path: 'loyalty-transactions',
    component: LoyaltyTransactionsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.adminAccess, loyaltyRoles.viewPointTransactions],
    },
  },
  {
    path: 'transactions',
    component: TransactionsRouteComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.adminAccess, loyaltyRoles.viewPointTransactions],
    },
    children: [
      {path: '', component: TransactionsComponent},
      {path: ':id', component: TransactionDetailsComponent},
    ],
  },
  {
    path: 'search-cards',
    component: SearchLoyaltyCardsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.adminAccess, loyaltyRoles.viewLoyaltyCards],
    },
  },
  {
    path: 'transactions-daily',
    component: LoyaltyDailyComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.adminAccess, loyaltyRoles.viewPointTransactions],
    },
  },
  {
    path: 'transactions-monthly',
    component: LoyaltyMonthlyComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.adminAccess, loyaltyRoles.viewPointTransactions],
    },
  },
  {
    path: 'cards',
    component: LoyaltyCardsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [loyaltyRoles.adminAccess, loyaltyRoles.viewLoyaltyCards],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoyaltyAffliateRoutingModule {}
