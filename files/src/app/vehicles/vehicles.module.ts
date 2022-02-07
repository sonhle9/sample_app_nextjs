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
import {VehicleRoutingModule} from './vehicles-routing.module';
import {VehicleComponent} from './pages/vehicle/vehicle.component';
import {VehicleListingComponent} from './pages/vehicle/vehicle-listing.component';
import {VehicleDetailsComponent} from './pages/vehicle/vehicle-details.component';

@NgModule({
  declarations: [VehicleComponent, VehicleListingComponent, VehicleDetailsComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    VehicleRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class VehiclesModule {}
