import {NgModule} from '@angular/core';
import {CardViewComponent} from './pages/card-view/card-view.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared-module.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {CardsRoutingModule} from './cards-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {FlexLayoutModule} from '@angular/flex-layout';
// import {CardDetailsComponent} from './pages/card-details/card-details';
import {MomentModule} from 'ngx-moment';
import {CarddetailsCardholderComponent} from './pages/card-details-cardholder/card-details-cardholder';
import {CarddetailsVehicleComponent} from './pages/card-details-vehicle/card-details-vehicle';
import {CarddetailsRestrictionComponent} from './pages/card-details-restriction/card-details-restriction';
import {CarddetailsTimelineComponent} from './pages/card-details-timeline/card-details-timeline';
import {CardDetailsRestrictionUpdateModalComponent} from './pages/card-details-restriction-update-modal/card-details-restriction-update-modal.component';
import {CarddetailsModalComponent} from './pages/card-details-modal/card-details-modal.component';
import {CardAddModalComponent} from './pages/card-add-modal/card-add-modal.component';
import {CardReplacementModalComponent} from './pages/card-replacement-modal/card-replacement-modal.component';
import {CardDetailsFinancialComponent} from './pages/card-details-financial/card-details-financial.component';
import {CardDetailsComponent} from './pages/card/card-details.component';
import {CardListComponent} from './pages/card/card-listing.component';

@NgModule({
  declarations: [
    CardListComponent,
    CardViewComponent,
    CardDetailsComponent,
    CarddetailsCardholderComponent,
    CarddetailsVehicleComponent,
    CarddetailsRestrictionComponent,
    CarddetailsTimelineComponent,
    CardDetailsRestrictionUpdateModalComponent,
    CarddetailsModalComponent,
    CardAddModalComponent,
    CardReplacementModalComponent,
    CardDetailsFinancialComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    CardsRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
  entryComponents: [
    CardDetailsRestrictionUpdateModalComponent,
    CarddetailsModalComponent,
    CardAddModalComponent,
    CardReplacementModalComponent,
  ],
  exports: [CarddetailsModalComponent, CardAddModalComponent, CardReplacementModalComponent],
})
export class CardsModule {}
