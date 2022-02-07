import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared-module.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';
import {CardGroupsRoutingModule} from './card-groups-routing.module';
import {CardGroupListingComponent} from './pages/card-group-listing.component';
import {CardGroupDetailsComponent} from './pages/card-group-details.component';

@NgModule({
  declarations: [CardGroupListingComponent, CardGroupDetailsComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    CardGroupsRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class CardGroupsModule {}
