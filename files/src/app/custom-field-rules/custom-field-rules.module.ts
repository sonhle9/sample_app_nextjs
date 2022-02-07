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
import {CustomFieldRulesRoutingModule} from './custom-field-rules-routing.module';
import {CustomFieldRulesDetailsComponent} from './pages/custom-field-rules-details.component';
import {CustomFieldRulesListingComponent} from './pages/custom-field-rules-listing.component';
import {CustomFieldRulesComponent} from './pages/custom-field-rules.component';

@NgModule({
  declarations: [
    CustomFieldRulesListingComponent,
    CustomFieldRulesListingComponent,
    CustomFieldRulesDetailsComponent,
    CustomFieldRulesComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    CustomFieldRulesRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class CustomFieldRulesModule {}
