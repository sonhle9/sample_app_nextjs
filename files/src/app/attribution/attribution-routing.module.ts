import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AttributionComponent} from './pages/attribution.component';
import {AttributionDetailsComponent} from './pages/attribution-details.component';
import {AuthResolver} from '../auth.guard';
import {attributionRoles} from 'src/shared/helpers/roles.type';
import {EnterpriseProductsResolver} from '../enterprise-product-offering.guard';
import {EnterpriseProducts} from '../../shared/enums/enterprise.enum';

const routes: Routes = [
  {
    path: 'attribution-rules',
    component: AttributionComponent,
    canActivate: [AuthResolver, EnterpriseProductsResolver],
    data: {
      roles: [attributionRoles.view],
      productKey: EnterpriseProducts.ATTRIBUTION,
    },
  },
  {
    path: 'attribution-rules/:id',
    component: AttributionDetailsComponent,
    canActivate: [AuthResolver, EnterpriseProductsResolver],
    data: {
      roles: [attributionRoles.view],
      productKey: EnterpriseProducts.ATTRIBUTION,
    },
  },
  {
    path: '',
    redirectTo: 'attribution-rules',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttributionRoutingModule {}
