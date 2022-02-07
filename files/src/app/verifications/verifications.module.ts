import {NgModule} from '@angular/core';
import {VerificationDetailsComponent} from './pages/verifications-details.component';
import {VerificationsListingComponent} from './pages/verifications-list.component';
import {VerificationsRoutingModule} from './verifications-routing.module';

@NgModule({
  declarations: [VerificationsListingComponent, VerificationDetailsComponent],
  imports: [VerificationsRoutingModule],
})
export class VerificationsModule {}
