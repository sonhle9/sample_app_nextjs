import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {cardRole} from '../../shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {CardDetailsComponent} from './pages/card/card-details.component';
import {CardListComponent} from './pages/card/card-listing.component';

const routes: Routes = [
  {
    path: 'cards',
    component: CardListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [cardRole.menu],
    },
  },
  {
    path: 'cards/:id',
    component: CardDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [cardRole.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardsRoutingModule {}
