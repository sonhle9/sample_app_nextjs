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
import {TerminalComponent} from './components/terminals.component';
import {TerminalsListingComponent} from './components/terminals-listing.component';
import {TerminalsDetailsComponent} from './components/terminals-details.component';
import {TerminalsRoutingModule} from './terminals-routing.module';

@NgModule({
  declarations: [TerminalComponent, TerminalsListingComponent, TerminalsDetailsComponent],
  imports: [
    TerminalsRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class TerminalsModule {}
