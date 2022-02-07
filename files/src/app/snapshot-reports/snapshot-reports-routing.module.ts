import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {snapshotReportConfigAccess as pdbConfigAccess} from 'src/shared/helpers/pdb.roles.type';
import {snapshotReportConfigAccess as setelConfigAccess} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {SnapshotReportsDetailsComponent} from './pages/snapshot-reports-details.component';
import {SnapshotReportsListingComponent} from './pages/snapshot-reports-listing.component';
import {SnapshotReportsExampleComponent} from './pages/snapshot-reports-example.component';

const routes: Routes = [
  {
    path: '',
    component: SnapshotReportsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [setelConfigAccess, pdbConfigAccess.read],
    },
  },
  {
    path: 'example/card',
    component: SnapshotReportsExampleComponent,
    data: {
      roles: [setelConfigAccess, pdbConfigAccess.read],
    },
  },
  {
    path: ':id',
    component: SnapshotReportsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [setelConfigAccess, pdbConfigAccess.read],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SnapshotReportsRoutingModule {}
