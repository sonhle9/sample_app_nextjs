import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {cardHolderRole} from '../../shared/helpers/roles.type';
import {CardholderDetailsComponent} from './pages/cardholder-details.component';
import {AuthResolver} from '../auth.guard';
import {CardholderListingComponent} from './pages/cardholder-listing.component';

const routes: Routes = [
  {
    path: 'cardholders',
    canActivate: [AuthResolver],
    component: CardholderListingComponent,
    data: {
      roles: [cardHolderRole.view],
    },
  },
  {
    path: 'cardholders/:id',
    canActivate: [AuthResolver],
    component: CardholderDetailsComponent,
    data: {
      roles: [cardHolderRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardholdersRoutingModule {}
