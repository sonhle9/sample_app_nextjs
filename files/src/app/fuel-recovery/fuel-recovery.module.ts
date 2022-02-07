import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SharedModule} from './../../shared/shared-module.module';
import {ComponentsModule} from './../../shared/components/components.module';
import {FuelRecoveryRoutingModule} from './fuel-recovery-routing.module';

import {FuelRecoveryPendingListComponent} from './fuel-recovery-pending-list/fuel-recovery-pending-list.component';
import {FuelRecoveryLostListComponent} from './fuel-recovery-lost-list/fuel-recovery-lost-list.component';
import {FuelRecoveryAddInfoModalComponent} from './fuel-recovery-add-info-modal/fuel-recovery-add-info-modal.component';
import {FuelRecoveryViewComponent} from './fuel-recovery-view/fuel-recovery-view.component';
import {FuelRecoveryAddMarkLostModalComponent} from './fuel-recovery-add-mark-lost-modal/fuel-recovery-add-mark-lost-modal.component';

@NgModule({
  declarations: [
    FuelRecoveryPendingListComponent,
    FuelRecoveryLostListComponent,
    FuelRecoveryAddInfoModalComponent,
    FuelRecoveryViewComponent,
    FuelRecoveryAddMarkLostModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FuelRecoveryRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  entryComponents: [FuelRecoveryAddInfoModalComponent, FuelRecoveryAddMarkLostModalComponent],
})
export class FuelRecoveryModule {}
