import {NgModule} from '@angular/core';
import {CollectionsListingComponent} from './components/collections-listing.component';
import {CollectionsRoutingModule} from './collections-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import CollectionsDownloadComponent from './components/collections-download';

@NgModule({
  declarations: [CollectionsListingComponent, CollectionsDownloadComponent],
  imports: [CollectionsRoutingModule, ComponentsModule],
})
export class CollectionsModule {}
