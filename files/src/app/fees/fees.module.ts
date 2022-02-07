import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {FeesRoutingModule} from './fees-routing.module';
import FeesListingComponent from './components/fees-listing.component';
import FeesDownloadComponent from './components/fees-download.component';

@NgModule({
  declarations: [FeesListingComponent, FeesDownloadComponent],
  imports: [ComponentsModule, FeesRoutingModule],
})
export class FeesModule {}
