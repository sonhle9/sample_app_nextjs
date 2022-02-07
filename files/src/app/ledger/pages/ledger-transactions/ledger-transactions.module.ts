import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {LedgerTransactionsRoutingModule} from '../ledger-transactions/ledger-transactions-routing.module';
import {LedgerTransactionsDetailsComponent} from './pages/ledger-transactions-details.component';
import {LedgerTransactionsListingComponent} from './pages/ledger-transactions-listing.component';

@NgModule({
  declarations: [LedgerTransactionsDetailsComponent, LedgerTransactionsListingComponent],
  imports: [CommonModule, ComponentsModule, LedgerTransactionsRoutingModule],
})
export class LedgerTransactionsModule {}
