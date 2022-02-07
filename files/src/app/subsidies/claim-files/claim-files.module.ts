import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../../shared/components/components.module';
import {SubsidyClaimFilesComponent} from './components/claim-files.component';
import {SubsidyClaimFileRoutingModule} from './claim-files-routing.module';

@NgModule({
  declarations: [SubsidyClaimFilesComponent],
  imports: [SubsidyClaimFileRoutingModule, ComponentsModule],
})
export class ClaimFilesModule {}
