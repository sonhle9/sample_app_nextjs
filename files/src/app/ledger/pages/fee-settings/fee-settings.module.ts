import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {FeeSettingsRoutingModule} from './fee-settings-routing.module';
import {FeeSettingsDetailComponent} from './pages/fee-settings-details.component';
import {FeeSettingsListingComponent} from './pages/fee-settings-listing.component';

@NgModule({
  declarations: [FeeSettingsListingComponent, FeeSettingsDetailComponent],
  imports: [CommonModule, ComponentsModule, FeeSettingsRoutingModule],
})
export class FeeSettingsModule {}
