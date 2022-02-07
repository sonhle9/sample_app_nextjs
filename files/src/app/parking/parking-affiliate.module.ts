import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {SharedModule} from 'src/shared/shared-module.module';
import {ParkingAffiliateRoutingModule} from './parking-affiliate-routing.module';
import {ParkingSessionsRouteComponent} from './pages/sessions/parking-sessions-route-component';
import {ParkingSessionsComponent} from './pages/sessions/parking-sessions';
import {ParkingSessionDetailsComponent} from './pages/sessions/parking-sessions-details';

@NgModule({
  declarations: [
    ParkingSessionsRouteComponent,
    ParkingSessionsComponent,
    ParkingSessionDetailsComponent,
  ],
  imports: [ComponentsModule, SharedModule, ParkingAffiliateRoutingModule],
})
export class ParkingAffiliateModule {}
