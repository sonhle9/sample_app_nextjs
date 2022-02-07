import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared-module.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {CardRangeRoutingModule} from './card-range-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';
import {CardRangeViewComponent} from './pages/card-range-view/card-range-view.component';
import {CardRangeModalComponent} from './pages/card-range-modal/card-range-modal.component';
import {CardRangeListingComponent} from './pages/card-range-listing.component';
import {CardRangeDetailsComponent} from './pages/card-range-details.component';

@NgModule({
  declarations: [
    CardRangeListingComponent,
    CardRangeViewComponent,
    CardRangeModalComponent,
    CardRangeDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    CardRangeRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
  entryComponents: [CardRangeModalComponent],
})
export class CardRangeModule {}
