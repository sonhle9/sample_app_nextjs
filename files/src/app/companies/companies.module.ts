import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MomentModule} from 'ngx-moment';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {SharedModule} from '../../shared/shared-module.module';
import {CompaniesRoutingModule} from './companies-routing.module';
import {CompaniesComponent} from './pages/companies/companies.component';
import {CompanyDetailsComponent} from './pages/companies/company-details.component';
import {CompanyListingComponent} from './pages/companies/company-listing.component';
import {SmartpayCompanyAddressDetailsComponent} from './pages/companies/smartpay-company-address-details.component';
import {SmartpayCompanyContactDetailsComponent} from './pages/companies/smartpay-company-contact-details.component';

@NgModule({
  declarations: [
    CompaniesComponent,
    CompanyListingComponent,
    CompanyDetailsComponent,
    SmartpayCompanyAddressDetailsComponent,
    SmartpayCompanyContactDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    CompaniesRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class CompaniesModule {}
