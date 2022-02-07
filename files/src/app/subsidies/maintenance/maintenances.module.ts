import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../../shared/components/components.module';
import {SubsidiesMaintenancesComponent} from './components/maintenances.component';
import {SubsidyMaintenanceRoutingModule} from './maintenances-routing.module';

@NgModule({
  declarations: [SubsidiesMaintenancesComponent],
  imports: [SubsidyMaintenanceRoutingModule, ComponentsModule],
})
export class MaintenancesModule {}
