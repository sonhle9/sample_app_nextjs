import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OutageComponent} from './pages/outage/outage.component';
import {OutageRoutingModule} from './outage-routing.module';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {OutageAnnoucementComponent} from './components/outage-annoucement/outage-annoucement.component';
import {OutageOverrideComponent} from './components/outage-override/outage-override.component';
import {OutageComponent as Outage} from './components/outage.component';
import {OutageChatSupportComponent} from './components/outage-live-chat';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    OutageRoutingModule,
    CommonModule,
  ],
  declarations: [
    OutageComponent,
    OutageAnnoucementComponent,
    OutageOverrideComponent,
    Outage,
    OutageChatSupportComponent,
  ],
})
export class OutageModule {}
