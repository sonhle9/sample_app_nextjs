import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CardReportsRoutingModule} from './card-reports-routing.module';
import {CardReportsComponent} from './card-reports.component';
import {CardReportsDownloadComponent} from './card-reports-download.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [CardReportsComponent, CardReportsDownloadComponent],
  imports: [CommonModule, ComponentsModule, CardReportsRoutingModule],
})
export class CardReportsModule {}
