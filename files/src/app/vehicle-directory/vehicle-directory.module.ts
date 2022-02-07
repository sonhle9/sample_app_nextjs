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
import {VehicleBrandListingComponent} from './pages/brand/brand-listing.component';
import {VehicleDirectoryComponent} from './vehicle-directory.component';
import {VehicleDirectoryRoutingModule} from './vehicle-directory-routing.module';
import {VehicleModelListingComponent} from './pages/model/model-listing.component';

@NgModule({
  declarations: [
    VehicleDirectoryComponent,
    VehicleBrandListingComponent,
    VehicleModelListingComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    VehicleDirectoryRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class VehicleDirectoryModule {}
