import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {VouchersBatchesComponent} from './pages/vouchers-batches/vouchersBatches';
import {VouchersBatchCreateComponent} from './pages/vouchers-batch-create/vouchersBatchCreate';
import {VouchersBatchDetailsComponent} from './pages/vouchers-batch-details/vouchersBatchDetails';
import {VouchersBatchEditComponent} from './pages/vouchers-batch-edit/vouchersBatchEdit';
import {VouchersValidateComponent} from './pages/vouchers-validate/vouchersValidate';
import {VouchersValidateComponent as VouchersValidate} from './pages/vouchers-validate/vouchers-validate.component';
import {VouchersDetailsComponent} from './pages/vouchers-details/vouchersDetails';
import {AuthResolver} from '../auth.guard';
import {
  vouchersBatchRole,
  vouchersValidateRole,
  extVouchersReportRole,
} from '../../shared/helpers/roles.type';
import {customerRole} from '../../shared/helpers/roles.type';
import {VouchersBatchReportComponent} from './pages/vouchers-batch-report/vouchersBatchReport';
import {ExtVouchersReportComponent} from './pages/ext-vouchers-report/extVouchersReport';
import {ExtVouchersReportComponent as ExtVouchersReport} from './pages/ext-vouchers-report/ext-vouchers-report.component';

import {VouchersBatchesComponent as VouchersBatches} from './pages/vouchers-batches/vouchers-batches.component';
import {VouchersBatchReportComponent as VouchersBatchReport} from './pages/vouchers-batch-report/vouchers-batch-report.component';
import {VouchersBatchesDetailsComponent as VouchersBatchDetails} from './pages/vouchers-batch-details/vouches-batch-details.component';
const routes: Routes = [
  {
    path: 'voucher-batches',
    component: VouchersBatchesComponent,
  },
  {
    path: 'voucher-batches/list',
    component: VouchersBatches,
  },
  {
    path: 'voucher-batches/details/:id',
    component: VouchersBatchDetails,
  },
  {
    path: 'voucher-validations/list',
    component: VouchersValidate,
  },
  {
    path: 'batches/report',
    component: VouchersBatchReportComponent,
  },
  {
    path: 'batches/report/list',
    component: VouchersBatchReport,
  },
  {
    path: 'batches/report/list/:id',
    component: VouchersBatchDetails,
  },
  {
    path: 'batches/view/:id',
    component: VouchersBatchDetailsComponent,
  },
  {
    path: 'batches/create',
    component: VouchersBatchCreateComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [vouchersBatchRole.create],
    },
  },
  {
    path: 'batches/clone/:batchId',
    component: VouchersBatchCreateComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [vouchersBatchRole.create],
    },
  },
  {
    path: 'batches/edit/:batchId',
    component: VouchersBatchEditComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [vouchersBatchRole.update],
    },
  },
  {
    path: 'voucher-validations',
    component: VouchersValidateComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [vouchersValidateRole.validate],
    },
  },
  {
    path: ':code',
    component: VouchersDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [customerRole.read],
    },
  },
  {
    path: 'ext-vouchers-report/e-pay-recon',
    component: ExtVouchersReportComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [extVouchersReportRole.read],
    },
  },
  {
    path: 'ext-vouchers-report/e-pay-recon/list',
    component: ExtVouchersReport,
    canActivate: [AuthResolver],
    data: {
      roles: [extVouchersReportRole.read],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VouchersRoutingModule {}
