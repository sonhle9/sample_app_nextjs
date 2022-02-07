import {NgModule} from '@angular/core';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {VouchersBatchesComponent} from './pages/vouchers-batches/vouchersBatches';
import {VouchersBatchCreateComponent} from './pages/vouchers-batch-create/vouchersBatchCreate';
import {VouchersRoutingModule} from './vouchers-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {VouchersBatchDetailsComponent} from './pages/vouchers-batch-details/vouchersBatchDetails';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MomentModule} from 'ngx-moment';
import {VouchersBatchRulesComponent} from './shared/vouchers-batch-rules/vouchersBatchRules';
import {VouchersBatchEditComponent} from './pages/vouchers-batch-edit/vouchersBatchEdit';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MaterialModule} from '../../shared/material/material.module';
import {VouchersValidateComponent} from './pages/vouchers-validate/vouchersValidate';
import {VouchersValidateComponent as VouchersValidate} from './pages/vouchers-validate/vouchers-validate.component';
import {VouchersDetailsComponent} from './pages/vouchers-details/vouchersDetails';
import {VouchersBatchReportComponent} from './pages/vouchers-batch-report/vouchersBatchReport';
import {VouchersBatchReportComponent as VouchersBatchReport} from './pages/vouchers-batch-report/vouchers-batch-report.component';
import {VouchersBatchesDetailsComponent as VouchersBatchesDetails} from './pages/vouchers-batch-details/vouches-batch-details.component';
import {ExtVouchersReportComponent} from './pages/ext-vouchers-report/extVouchersReport';
import {VouchersBatchesComponent as VouchersBatches} from './pages/vouchers-batches/vouchers-batches.component';
import {ExtVouchersReportComponent as ExtVouchersReport} from './pages/ext-vouchers-report/ext-vouchers-report.component';
@NgModule({
  declarations: [
    VouchersBatches,
    VouchersBatchesComponent,
    VouchersBatchReportComponent,
    VouchersBatchReport,
    VouchersBatchCreateComponent,
    VouchersBatchRulesComponent,
    VouchersBatchDetailsComponent,
    VouchersBatchEditComponent,
    VouchersValidateComponent,
    VouchersValidate,
    VouchersDetailsComponent,
    VouchersBatchesDetails,
    ExtVouchersReportComponent,
    ExtVouchersReport,
  ],
  imports: [
    NgxDatatableModule,
    CommonModule,
    ComponentsModule,
    VouchersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxJsonViewerModule,
    MomentModule,
    PipesModule,
    MaterialModule,
  ],
  exports: [VouchersBatchRulesComponent],
})
export class VouchersModule {}
