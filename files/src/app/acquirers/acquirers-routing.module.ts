import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {adminRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {AcquirerDetailsComponent} from './pages/acquirer-details.component';
import {AcquirersListingComponent} from './pages/acquirers-listing.component';

const routes: Routes = [
  {
    path: 'listing',
    component: AcquirersListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminRole.userMenu],
    },
  },
  {
    path: 'details/:id',
    component: AcquirerDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminRole.userMenu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcquirersRoutingModule {}
