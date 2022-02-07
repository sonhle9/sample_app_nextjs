import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {NgModule} from '@angular/core';
import {MerchantTypesComponent} from './pages/merchant-types.component';
import {MerchantTypesListingComponent} from './pages/merchant-types-listing.component';
import {MerchantTypesDetailComponent} from './pages/merchant-types.detail.component';
import {merchantRole} from '../../shared/helpers/roles.type';
import {SalesTerritoriesDetailComponent} from './pages/sales-teritories-details.component';

const routes: Routes = [
  {
    path: '',
    component: MerchantTypesComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
    children: [
      {
        path: '',
        component: MerchantTypesListingComponent,
      },
      {
        path: ':id',
        component: MerchantTypesDetailComponent,
      },
      {
        path: 'sales-territory/:id',
        component: SalesTerritoriesDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantTypesRoutingModule {}
