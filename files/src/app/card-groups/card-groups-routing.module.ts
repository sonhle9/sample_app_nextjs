import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {cardGroupRole} from '../../shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {CardGroupListingComponent} from './pages/card-group-listing.component';
import {CardGroupDetailsComponent} from './pages/card-group-details.component';

const routes: Routes = [
  {
    path: 'card-groups',
    canActivate: [AuthResolver],
    component: CardGroupListingComponent,
    data: {
      roles: [cardGroupRole.view],
    },
  },
  {
    path: 'card-groups/:id',
    canActivate: [AuthResolver],
    component: CardGroupDetailsComponent,
    data: {
      roles: [cardGroupRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardGroupsRoutingModule {}
