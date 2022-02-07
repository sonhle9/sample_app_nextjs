import {NgModule} from '@angular/core';
import {CashflowsComponent} from './pages/cashflows/cashflows.component';
import {CommonModule} from '@angular/common';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {SharedModule} from '../../shared/shared-module.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LedgerAdjustModalComponent} from './pages/ledger-adjust-modal/ledger-adjust-modal.component';
import {LedgerTransferModalComponent} from './pages/ledger-transfer-modal/ledger-transfer-modal.component';
import {LedgerRoutingModule} from './ledger-routing.module';

@NgModule({
  declarations: [CashflowsComponent, LedgerAdjustModalComponent, LedgerTransferModalComponent],
  imports: [
    CommonModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
    MomentModule,
    LedgerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [LedgerAdjustModalComponent, LedgerTransferModalComponent],
})
export class LedgerModule {}
