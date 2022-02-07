import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared-module.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MerchantsRoutingModule} from './merchants-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MerchantViewComponent} from './pages/merchant-view/merchant-view.component';
import {MerchantListingComponent} from './pages/merchant-listing/merchant-listing.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MerchantDetailsComponent} from './pages/merchant-details/merchant-details';
import {TypesListingComponent} from './pages/types-listing/types-listing.component';
import {SmartpayAccountChildren} from './pages/smartpay-account/smartpay-account-children-details';
import {SmartpayAccountDetailsComponent} from './pages/merchant-details/smartpay-account-details';
import {SmartpayAppDetailsComponent} from './pages/smartpay-app-details/smartpay-app-details';
import {PeriodOverrunComponent} from './pages/smartpay-account/period-overrun';

@NgModule({
  declarations: [
    MerchantDetailsComponent,
    MerchantViewComponent,
    MerchantListingComponent,
    TypesListingComponent,
    SmartpayAccountChildren,
    SmartpayAccountDetailsComponent,
    SmartpayAppDetailsComponent,
    PeriodOverrunComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MerchantsRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
  ],
  exports: [],
})
export class MerchantsModule {}
