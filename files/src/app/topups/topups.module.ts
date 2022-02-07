import {NgModule} from '@angular/core';
import {TopupDetailsComponent} from './pages/topup-details/topup-details.component';
import {TopupListComponent} from './pages/topup-list/topup-list.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MomentModule} from 'ngx-moment';
import {TopupsRoutingModule} from './topups-routing.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MatPaginatorModule} from '@angular/material/paginator';
import {SharedModule} from '../../shared/shared-module.module';
import {WalletTopupListingComponent} from './pages/wallet-topup-listing.component';
import {WalletTopupDetailsComponent} from './pages/wallet-topup-details.component';

@NgModule({
  declarations: [
    TopupDetailsComponent,
    TopupListComponent,
    WalletTopupListingComponent,
    WalletTopupDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    NgxDatatableModule,
    CommonModule,
    MatPaginatorModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    SharedModule,
    TopupsRoutingModule,
    NgxJsonViewerModule,
  ],
})
export class TopupsModule {}
