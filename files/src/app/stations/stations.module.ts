import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from './../../shared/shared-module.module';
import {AgmCoreModule} from '@agm/core';

import {DirectivesModule} from '../../shared/directives/directives.module';
import {StationsComponent} from './pages/stations/stations';
import {StationsRoutingModule} from './stations-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {EditStationDetailsComponent} from './pages/editStationDetails/editStationDetails';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {StationOrdersComponent} from './pages/station-orders/station-orders.component';
import {StationInCarOrdersComponent} from './pages/station-in-car-orders/station-in-car-orders.component';
import {StationDetailsBetaComponent} from './pages/station-details/station-details-beta.component';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {StationStoreOrdersComponent} from './pages/station-store-orders/station-store-orders.component';
import {StationDetailsMapComponent} from './pages/station-details-map/station-details-map.component';
import {StationListingComponent} from './pages/station-listing.component';
import {StationDetailsComponent} from './pages/station-details/station-details.component';

@NgModule({
  declarations: [
    StationsComponent,
    EditStationDetailsComponent,
    StationOrdersComponent,
    StationInCarOrdersComponent,
    StationDetailsBetaComponent,
    StationStoreOrdersComponent,
    StationDetailsMapComponent,
    StationListingComponent,
    StationDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    StationsRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAWXBpTHOCSkqZZYU9RFVuRuibgUx2FFSI',
    }),
    AgmJsMarkerClustererModule,
  ],
})
export class StationsModule {}
