import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billingPlansRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {BillingPlansListingComponent} from './components/billing-plans-listing.component';
import {BillingPlansDetailComponent} from './components/billing-plans-detail.component';

const routes: Routes = [
  {
    path: '',
    component: BillingPlansListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingPlansRole.view],
    },
  },
  {
    path: ':id',
    component: BillingPlansDetailComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingPlansRole.modify],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingPlansRoutingModule {}
