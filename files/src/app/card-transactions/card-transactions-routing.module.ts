import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {cardTransactionRole} from '../../shared/helpers/roles.type';
import {CardTransactionsListComponent} from './pages/card-transactions-list/card-transactions-list.component';
import {CardTransactionsDetailsComponent} from './pages/card-transactions-details/card-transactions-details.component';
import {AuthResolver} from '../auth.guard';
import {SettlementBatchComponent} from './pages/settlement-batch/settlement-batch.component';
import {CardTransactionsFleetDetailsComponent} from './components/card-transactions-fleet-details.component';

const routes: Routes = [
  {
    path: 'card-transactions',
    canActivate: [AuthResolver],
    component: CardTransactionsListComponent,
    data: {
      roles: [cardTransactionRole.view],
    },
  },
  {
    path: 'card-transactions/:id',
    canActivate: [AuthResolver],
    component: CardTransactionsDetailsComponent,
    data: {
      roles: [cardTransactionRole.view],
    },
  },
  {
    path: 'card-transactions-fleet/:id',
    canActivate: [AuthResolver],
    component: CardTransactionsFleetDetailsComponent,
    data: {
      roles: [cardTransactionRole.view],
    },
  },
  {
    path: 'settlement-batch',
    canActivate: [AuthResolver],
    component: SettlementBatchComponent,
    data: {
      roles: [cardTransactionRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardTransactionsRoutingModule {}
