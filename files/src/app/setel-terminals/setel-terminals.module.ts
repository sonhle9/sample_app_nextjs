import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {SharedModule} from '../../shared/shared-module.module';
import {TerminalsDetailsComponent} from './components/terminal-details.component';
import {SetelTerminalsRoutingModule} from './routing.module';
import {TerminalsListingTabComponent} from './components/terminals-listing-tab.component';
import {TerminalsInventoryComponent} from './components/terminals-inventory.component';

@NgModule({
  declarations: [
    TerminalsDetailsComponent,
    TerminalsListingTabComponent,
    TerminalsInventoryComponent,
  ],
  imports: [
    SetelTerminalsRoutingModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
    SharedModule,
  ],
})
export class SetelTerminalsModule {}
