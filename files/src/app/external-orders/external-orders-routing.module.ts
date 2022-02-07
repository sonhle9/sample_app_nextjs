import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ExternalOrderDetailsComponent} from './pages/external-order-details/external-order-details.component';
import {AuthResolver} from '../auth.guard';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {BulkUpdateComponent} from './pages/bulk-update/bulk-update.component';
import {ExternalOrdersBulkUpdateComponent} from './pages/external-orders-bulk-update.component';

const routes: Routes = [
  {
    path: '',
    component: null,
    canActivate: [AuthResolver],
    children: [
      {path: 'bulk-update', component: BulkUpdateComponent},
      {path: 'bulk-update-beta', component: ExternalOrdersBulkUpdateComponent},
    ],
    data: {
      roles: [retailRoles.externalOrderView],
    },
  },
  {
    path: ':id',
    component: ExternalOrderDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.externalOrderView],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalOrdersRoutingModule {}
