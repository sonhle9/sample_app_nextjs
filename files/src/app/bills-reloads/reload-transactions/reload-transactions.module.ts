import {NgModule} from '@angular/core';
import {ReloadTransactionsListingComponent} from './components/reload-transactions-listing.component';
import {ReloadTransactionsRoutingModule} from './reload-transactions-routing.module';
import {ComponentsModule} from '../../../shared/components/components.module';

@NgModule({
  declarations: [ReloadTransactionsListingComponent],
  imports: [ReloadTransactionsRoutingModule, ComponentsModule],
})
export class ReloadTransactionsModule {}
