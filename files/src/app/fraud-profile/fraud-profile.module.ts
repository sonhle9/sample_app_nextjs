import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {SharedModule} from '../../shared/shared-module.module';
import {DeviceDetailsComponent} from '../fraud-profile/pages/deviceDetails/deviceDetails.component';
import {DevicesComponent} from '../fraud-profile/pages/devices/devices.component';
import {DeviceConfirmModalComponent} from '../fraud-profile/components/deviceConfirmModal/deviceConfirmModal.component';
import {DeviceTableComponent} from './components/devicesTable/deviceTable.component';
import {FraudProfileRoutingModule} from './fraud-profile-routing.module';
import {FraudProfileModalComponent} from './pages/fraud-profile-modal/fraudProfileModal.component';
import {FraudProfileListComponent} from './pages/fraud-profile-list/fraudProfileList.component';
import {FraudProfileDetailsComponent} from './pages/fraud-profile-details/fraudProfileDetails.component';
import {CustomerLimitationsModalComponent} from './pages/customer-limitations/customerLimitationsModal.component';
import {FraudProfileDetailsComponent as NewFraudProfileDetailsComponent} from './pages/fraud-profile-details.component';
import {FraudProfileListingComponent} from './pages/fraud-profile-listing.component';
import {AccountDevicesComponent} from './components/account-devices.component';
import {AccountDeviceDetailsComponent} from './components/account-device-details.component';
import {RiskProfileListingComponent} from './pages/risk-profile-listing.component';
import {RiskProfileDetailsComponent} from './pages/risk-profile-details.component';

@NgModule({
  declarations: [
    FraudProfileListComponent,
    FraudProfileDetailsComponent,
    FraudProfileModalComponent,
    CustomerLimitationsModalComponent,
    DeviceTableComponent,
    DevicesComponent,
    DeviceDetailsComponent,
    DeviceConfirmModalComponent,
    NewFraudProfileDetailsComponent,
    FraudProfileListingComponent,
    AccountDevicesComponent,
    AccountDeviceDetailsComponent,
    RiskProfileListingComponent,
    RiskProfileDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    FraudProfileRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MomentModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [FraudProfileModalComponent, DeviceTableComponent, MatFormFieldModule, MatInputModule],
  entryComponents: [
    FraudProfileModalComponent,
    CustomerLimitationsModalComponent,
    DeviceConfirmModalComponent,
  ],
})
export class FraudProfileModule {}
