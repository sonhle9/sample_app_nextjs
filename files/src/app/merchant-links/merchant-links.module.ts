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
import {MerchantLinkComponent} from './pages/merchant-link.component';
import {MerchantLinkListingComponent} from './pages/merchant-link-listing.component';
import {MerchantLinksRoutingModule} from './merchant-links-routing.module';
import {MerchantLinkDetailsComponent} from './pages/merchant-link.details.component';

@NgModule({
  declarations: [MerchantLinkComponent, MerchantLinkListingComponent, MerchantLinkDetailsComponent],
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
    MerchantLinksRoutingModule,
  ],
})
export class MerchantLinksModule {}
