import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {PipesModule} from '../../../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../../../shared/components/components.module';
import {DirectivesModule} from '../../../../shared/directives/directives.module';
import {ReceivablesRoutingModule} from './receivables-routing.module';
import {ReceivablesReconciliationsComponent} from './components/receivables-reconciliations/receivables-reconciliations';
import {ReceivablesExceptionsComponent} from './components/receivables-exceptions/receivables-exceptions';
import {SharedModule} from '../../../../shared/shared-module.module';
import {ReceivablesAdjustModalComponent} from './components/receivables-adjust-modal/receivable-adjust-modal';
import {ReceivablesDetailsComponent} from './pages/receivables-details.component';
import {ReceivablesListingComponent} from './pages/receivables-listing.component';
import {LegacyReceivablesDetailsComponent} from './pages/receivables-details/receivables-details';
import {LegacyReceivablesComponent} from './pages/receivables/receivables';

@NgModule({
  declarations: [
    LegacyReceivablesDetailsComponent,
    ReceivablesDetailsComponent,
    LegacyReceivablesComponent,
    ReceivablesListingComponent,
    ReceivablesReconciliationsComponent,
    ReceivablesExceptionsComponent,
    ReceivablesAdjustModalComponent,
  ], // all components must be included, regardless if it is used, else Ivy compiler (required for ng 12) will scream later
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    ReceivablesRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
  ],
  entryComponents: [ReceivablesAdjustModalComponent],
})
export class ReceivablesModule {}
