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
import {ExceptionsRoutingModule} from './exceptions-routing.module';
import {ExceptionDetailsComponent} from './pages/exception-details.component';
import {ExceptionListingComponent} from './pages/exception-listing.component';
import {ExceptionsComponent} from './pages/exceptions.component';

@NgModule({
  declarations: [ExceptionsComponent, ExceptionListingComponent, ExceptionDetailsComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    ExceptionsRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class ExceptionsModule {}
