import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {adminRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {CompaniesComponent} from './pages/companies/companies.component';
import {CompanyDetailsComponent} from './pages/companies/company-details.component';
import {CompanyListingComponent} from './pages/companies/company-listing.component';
import {SmartpayCompanyAddressDetailsComponent} from './pages/companies/smartpay-company-address-details.component';
import {SmartpayCompanyContactDetailsComponent} from './pages/companies/smartpay-company-contact-details.component';

const routes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminRole.userMenu],
    },
    children: [
      {
        path: '',
        component: CompanyListingComponent,
      },
      {
        path: ':id',
        component: CompanyDetailsComponent,
      },
      {
        path: ':companyId/smartpay-address/:addressId',
        component: SmartpayCompanyAddressDetailsComponent,
      },
      {
        path: ':companyId/smartpay-contact/:contactId',
        component: SmartpayCompanyContactDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
