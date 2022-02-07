import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {cardRangeRole} from '../../shared/helpers/roles.type';
import {CardRangeListingComponent} from './pages/card-range-listing.component';
import {CardRangeDetailsComponent} from './pages/card-range-details.component';
import {AuthResolver} from '../auth.guard';

const routes: Routes = [
  {
    path: 'card-ranges',
    canActivate: [AuthResolver],
    component: CardRangeListingComponent,
    data: {
      roles: [cardRangeRole.view],
    },
  },
  {
    path: 'card-ranges/:id',
    canActivate: [AuthResolver],
    component: CardRangeDetailsComponent,
    data: {
      roles: [cardRangeRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRangeRoutingModule {}
