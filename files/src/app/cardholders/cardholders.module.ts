import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared-module.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {CardholdersRoutingModule} from './cardholders-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';
import {CardholderViewComponent} from './pages/cardholder-view/cardholder-view.component';
import {CardholderListingComponent} from './pages/cardholder-listing.component';
import {CardholderDetailsComponent} from './pages/cardholder-details.component';

@NgModule({
  declarations: [CardholderListingComponent, CardholderViewComponent, CardholderDetailsComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    CardholdersRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class CardholdersModule {}
