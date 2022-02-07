import {NgModule} from '@angular/core';
import {FeeSettingsListingComponent} from './components/fee-settings-listing.component';
import {FeeSettingsRoutingModule} from './fee-settings-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {FeeSettingDetailsComponent} from './components/fee-settings-detail.component';

@NgModule({
  declarations: [FeeSettingsListingComponent, FeeSettingDetailsComponent],
  imports: [FeeSettingsRoutingModule, ComponentsModule],
})
export class FeeSettingsModule {}
