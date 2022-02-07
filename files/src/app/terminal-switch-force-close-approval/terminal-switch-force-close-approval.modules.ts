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
import {TerminalSwitchForceCloseApprovalDetailComponent} from './components/terminal-switch-force-close-approval-detail.component';
import {TerminalSwitchForceCloseApprovalListingComponent} from './components/terminal-switch-force-close-approval-listing.component';
import {TerminalSwitchForceCloseApprovalComponent} from './components/terminal-switch-force-close-approval.component';
import {TerminalSwitchForceCloseApprovalRoutingModules} from './terminal-switch-force-close-approval.router';

@NgModule({
  declarations: [
    TerminalSwitchForceCloseApprovalComponent,
    TerminalSwitchForceCloseApprovalListingComponent,
    TerminalSwitchForceCloseApprovalDetailComponent,
  ],
  imports: [
    TerminalSwitchForceCloseApprovalRoutingModules,
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
export class TerminalSwitchForceCloseApproval {}
