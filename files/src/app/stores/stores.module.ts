import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoresRoutingModule} from './stores-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared-module.module';
import {StoresListComponent} from './pages/stores-list/stores-list.component';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from '@danielmoncada/angular-datetime-picker';
import {MomentModule} from 'ngx-moment';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {StoreDetailsComponent} from './pages/store-details/store-details';

@NgModule({
  declarations: [StoreDetailsComponent, StoresListComponent],
  imports: [
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MomentModule,
    StoresRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DirectivesModule,
  ],
})
export class StoresModule {}
