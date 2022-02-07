import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MomentModule} from 'ngx-moment';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {SharedModule} from '../../shared/shared-module.module';
import {ReconciliationDetailsComponent} from './page/reconciliation-details.component';
import {ReconciliationListingComponent} from './page/reconciliation-listing.component';
import {ReconciliationsComponent} from './page/reconciliations.component';
import {ReconciliatonsRoutingModule} from './reconciliations-routing.module';

@NgModule({
  declarations: [
    ReconciliationsComponent,
    ReconciliationListingComponent,
    ReconciliationDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    ReconciliatonsRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class ReconciliationsModule {}
