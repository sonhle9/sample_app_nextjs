import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {NgModule} from '@angular/core';
import {MerchantLinkComponent} from './pages/merchant-link.component';
import {MerchantLinkListingComponent} from './pages/merchant-link-listing.component';
import {MerchantLinkDetailsComponent} from './pages/merchant-link.details.component';
import {merchantRole} from '../../shared/helpers/roles.type';

const routes: Routes = [
  {
    path: '',
    component: MerchantLinkComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
    children: [
      {
        path: '',
        component: MerchantLinkListingComponent,
      },
      {
        path: ':id',
        component: MerchantLinkDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantLinksRoutingModule {}
