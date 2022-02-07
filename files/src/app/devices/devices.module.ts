import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared-module.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {DevicesRoutingModule} from './devices-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {DeviceViewComponent} from './pages/device-view/device-view.component';
import {DeviceListComponent} from './pages/device-list/device-list.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {EditDeviceModalComponent} from './pages/edit-device-modal/edit-device-modal.component';
import {DeviceDetailsComponent} from './pages/device-details/device-details.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {MomentModule} from 'ngx-moment';
import {DeviceListingComponent} from './pages/device-listing.component';
import {DeviceDetailsComponent as NewDeviceDetailsComponent} from './pages/device-details.component';

@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceViewComponent,
    DeviceDetailsComponent,
    EditDeviceModalComponent,
    DeviceListingComponent,
    NewDeviceDetailsComponent,
  ],
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    DevicesRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
  exports: [],
  entryComponents: [EditDeviceModalComponent],
})
export class DevicesModule {}
