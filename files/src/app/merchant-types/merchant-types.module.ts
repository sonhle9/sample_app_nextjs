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
import {MerchantTypesComponent} from './pages/merchant-types.component';
import {MerchantTypesListingComponent} from './pages/merchant-types-listing.component';
import {MerchantTypesRoutingModule} from './merchant-types-routing.module';
import {MerchantTypesDetailComponent} from './pages/merchant-types.detail.component';
import {SalesTerritoriesDetailComponent} from './pages/sales-teritories-details.component';

@NgModule({
  declarations: [
    MerchantTypesComponent,
    MerchantTypesListingComponent,
    MerchantTypesDetailComponent,
    SalesTerritoriesDetailComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
    MerchantTypesRoutingModule,
  ],
})
export class MerchantTypesModule {}
