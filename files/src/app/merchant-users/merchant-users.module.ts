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
import {MerchantUsersListingComponent} from './pages/merchant-users-listing.component';
import {MerchantUsersRoutingModule} from './merchant-users-routing.module';
import {MerchantUsersDetailComponent} from './pages/merchant-users-detail.component';
import {MerchantUsersComponent} from './pages/merchant-users.component';

@NgModule({
  declarations: [
    MerchantUsersComponent,
    MerchantUsersListingComponent,
    MerchantUsersDetailComponent,
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
    MerchantUsersRoutingModule,
  ],
})
export class MerchantUsersModule {}
