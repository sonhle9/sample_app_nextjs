import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {AppVersionDetailsComponent} from './pages/app-version-details.component';
import {AppVersionListingComponent} from './pages/app-version-listing.component';
import {VersionsRoutingModule} from './versions-routing.module';

@NgModule({
  declarations: [AppVersionDetailsComponent, AppVersionListingComponent],
  imports: [ComponentsModule, VersionsRoutingModule],
})
export class VersionsModule {}
