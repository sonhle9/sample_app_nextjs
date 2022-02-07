import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {TransactionsComponent} from './pages/transactions/transactions';
import {transactionRole, customerRole} from 'src/shared/helpers/roles.type';
import {LoyaltyTransactionDetailsComponent} from './pages/loyalty-transaction-details/loyalty-transaction-details';
import {TransactionDetailsComponent} from './pages/transaction-details/transaction-details';
import {PaymentsTransactionsListingComponent} from './pages/payments-transactions-listing.component';
import {PaymentsTransactionsDetailsComponent} from './pages/payments-transactions-details.component';

const routes: Routes = [
  {
    path: 'loyalty/:id',
    component: LoyaltyTransactionDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [customerRole.menu, customerRole.read],
    },
  },
  {
    path: 'listing',
    component: PaymentsTransactionsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'details/:id',
    component: PaymentsTransactionsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: ':id',
    component: TransactionDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: '',
    component: TransactionsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
