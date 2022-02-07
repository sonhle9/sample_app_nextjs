import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {SnapshotReportsDetailsComponent} from './pages/snapshot-reports-details.component';
import {SnapshotReportsExampleComponent} from './pages/snapshot-reports-example.component';
import {SnapshotReportsListingComponent} from './pages/snapshot-reports-listing.component';
import {SnapshotReportsRoutingModule} from './snapshot-reports-routing.module';

@NgModule({
  declarations: [
    SnapshotReportsDetailsComponent,
    SnapshotReportsListingComponent,
    SnapshotReportsExampleComponent,
  ],
  imports: [CommonModule, DirectivesModule, SnapshotReportsRoutingModule],
})
export class SnapshotReportsModule {}
