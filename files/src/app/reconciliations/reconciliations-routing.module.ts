import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {reconciliationRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {ReconciliationDetailsComponent} from './page/reconciliation-details.component';
import {ReconciliationListingComponent} from './page/reconciliation-listing.component';
import {ReconciliationsComponent} from './page/reconciliations.component';

const routes: Routes = [
  {
    path: '',
    component: ReconciliationsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [reconciliationRole.view],
    },
    children: [
      {
        path: '',
        component: ReconciliationListingComponent,
        data: {
          roles: [reconciliationRole.view],
        },
      },
      {
        path: ':id',
        component: ReconciliationDetailsComponent,
        data: {
          roles: [reconciliationRole.view],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReconciliatonsRoutingModule {}
