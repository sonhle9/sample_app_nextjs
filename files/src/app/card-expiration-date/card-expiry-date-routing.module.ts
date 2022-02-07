import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {cardExpirationRole} from '../../shared/helpers/roles.type';
import {CardExpiryDateListComponent} from './pages/card-expiry-date-list/card-expiry-date-list.component';
import {CardExpiryDateDetailsComponent} from './pages/card-expiry-date-details/card-expiry-date-details.component';
import {AuthResolver} from '../auth.guard';

const routes: Routes = [
  {
    path: 'card-expiry-date',
    canActivate: [AuthResolver],
    component: CardExpiryDateListComponent,
    data: {
      roles: [cardExpirationRole.menu],
    },
  },
  {
    path: 'card-expiry-date/:id',
    canActivate: [AuthResolver],
    component: CardExpiryDateDetailsComponent,
    data: {
      roles: [cardExpirationRole.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardExpiryDateRoutingModule {}
