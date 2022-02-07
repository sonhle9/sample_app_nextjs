import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CommonModule} from '@angular/common';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgModule} from '@angular/core';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {PrefundingBalanceRoutingModule} from './prefunding-balance-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {PrefundingBalanceComponent} from './pages/prefunding-balance/prefunding-balance.component';

@NgModule({
  declarations: [PrefundingBalanceComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    PrefundingBalanceRoutingModule,
    NgxJsonViewerModule,
  ],
})
export class PrefundingBalanceModule {}
