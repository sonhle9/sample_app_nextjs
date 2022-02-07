import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {feesTransactionRole} from 'src/shared/helpers/roles.type';
import FeesListingComponent from './components/fees-listing.component';
import FeesDownloadComponent from './components/fees-download.component';

const routes: Routes = [
  {
    path: '',
    component: FeesListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [feesTransactionRole.view],
    },
  },
  {
    path: 'download',
    component: FeesDownloadComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [feesTransactionRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeesRoutingModule {}
