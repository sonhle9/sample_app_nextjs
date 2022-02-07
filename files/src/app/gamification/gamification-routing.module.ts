import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from 'src/app/auth.guard';
import {badgeCampaignsRoles, badgeRoles} from 'src/shared/helpers/roles.type';
import {BadgeDetailsComponent} from './pages/badge-details/badge-details.component';
import {BadgeCampaignsComponent} from './pages/badge-campaigns/badge-campaigns.component';
import {EnterpriseProductsResolver} from 'src/app/enterprise-product-offering.guard';
import {EnterpriseProducts} from 'src/shared/enums/enterprise.enum';

const routes: Routes = [
  {
    path: 'badge-campaigns',
    children: [
      {path: '', redirectTo: 'badge-list'},
      {
        path: ':tab',
        component: BadgeCampaignsComponent,
        canActivate: [AuthResolver, EnterpriseProductsResolver],
        data: {
          roles: [badgeCampaignsRoles.read],
          productKey: EnterpriseProducts.GAMIFICATION,
        },
      },
    ],
  },
  {
    path: 'badge-details',
    children: [
      {
        path: ':id',
        component: BadgeDetailsComponent,
        canActivate: [AuthResolver, EnterpriseProductsResolver],
        data: {
          roles: [badgeRoles.read],
          productKey: EnterpriseProducts.GAMIFICATION,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamificationRoutingModule {}
