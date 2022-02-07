import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthResolver} from '../auth.guard';
import {MerchantViewComponent} from './pages/merchant-view/merchant-view.component';
import {merchantRole} from '../../shared/helpers/roles.type';
import {MerchantDetailsComponent} from './pages/merchant-details/merchant-details';
import {MerchantListingComponent} from './pages/merchant-listing/merchant-listing.component';
import {TypesListingComponent} from './pages/types-listing/types-listing.component';
import {SmartpayAccountChildren} from './pages/smartpay-account/smartpay-account-children-details';
import {MerchantTypeCodes} from '../../shared/enums/merchant.enum';
import {SmartpayAccountDetailsComponent} from './pages/merchant-details/smartpay-account-details';
import {SmartpayAppDetailsComponent} from './pages/smartpay-app-details/smartpay-app-details';
import {PeriodOverrunComponent} from './pages/smartpay-account/period-overrun';

const routes: Routes = [
  {
    path: '',
    component: MerchantViewComponent,
    canActivate: [AuthResolver],
    children: [
      {path: '', component: MerchantListingComponent},
      {path: 'types/:code', component: TypesListingComponent},
      {path: ':id', component: MerchantDetailsComponent},
      {path: 'types/:code/:id', component: MerchantDetailsComponent},
      {
        path: `types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/application/:appId`,
        component: SmartpayAppDetailsComponent,
      },
      {
        path: `types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/merchant/:merchantId`,
        component: SmartpayAccountDetailsComponent,
      },
      {
        path: `types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/merchant/:merchantId/period-overrun/:periodOverrunId`,
        component: PeriodOverrunComponent,
      },
      {
        path: `types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}/:type/:id/:tab/:childrenId`,
        component: SmartpayAccountChildren,
      },
    ],
    data: {
      roles: [merchantRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantsRoutingModule {}
