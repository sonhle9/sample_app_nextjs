import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WaitingAreasRoutingModule} from './waiting-areas-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared-module.module';
import {WaitingAreasListComponent} from './pages/waiting-areas-list/waiting-areas-list.component';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {MomentModule} from 'ngx-moment';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {WaitingAreaDetailsComponent} from './pages/waiting-area-details/waiting-area-details.component';

@NgModule({
  declarations: [WaitingAreasListComponent, WaitingAreaDetailsComponent],
  imports: [
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MomentModule,
    WaitingAreasRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DirectivesModule,
  ],
})
export class WaitingAreasModule {}
