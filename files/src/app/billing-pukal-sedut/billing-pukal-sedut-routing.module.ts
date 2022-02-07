import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billingPukalSedutRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {BillingPukalSedutListingComponent} from './components/billing-pukal-sedut-listing.component';

const routes: Routes = [
  {
    path: '',
    component: BillingPukalSedutListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingPukalSedutRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingPukalSedutRoutingModule {}
