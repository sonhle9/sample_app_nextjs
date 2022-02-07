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
import {TerminalSwitchTransactionDetailComponent} from './components/terminal-switch-transactions-detail.component';
import {TerminalSwitchTransactionListingComponent} from './components/terminal-switch-transactions-listing.component';
import {TerminalSwitchTransactionComponent} from './components/terminal-switch-transactions.component';
import {TerminalSwitchTransactionRouter} from './terminal-switch-transactions.router';

@NgModule({
  declarations: [
    TerminalSwitchTransactionComponent,
    TerminalSwitchTransactionListingComponent,
    TerminalSwitchTransactionDetailComponent,
  ],
  imports: [
    TerminalSwitchTransactionRouter,
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
export class TerminalSwitchTransactionModule {}
