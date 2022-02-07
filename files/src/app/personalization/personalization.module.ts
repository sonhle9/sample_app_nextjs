import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {GlobalVariablesComponent} from './pages/globalVariables/global-variables.component';
import {InterfaceComponentComponent} from './pages/interface-component.component';
import {VariableDetailsComponent} from './pages/variables/variable-details.component';
import {VariablesListComponent} from './pages/variables/variables-list.component';
import {PersonalizationRoutingModule} from './personalization-routing.module';

@NgModule({
  declarations: [
    GlobalVariablesComponent,
    VariablesListComponent,
    VariableDetailsComponent,
    InterfaceComponentComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    ComponentsModule,
    PersonalizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxJsonViewerModule,
  ],
})
export class PersonalizationModule {}
