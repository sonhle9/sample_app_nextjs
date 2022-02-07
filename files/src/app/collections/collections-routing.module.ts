import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {collectionTransactionsRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import CollectionsDownloadComponent from './components/collections-download';
import {CollectionsListingComponent} from './components/collections-listing.component';

const routes: Routes = [
  {
    path: '',
    component: CollectionsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [collectionTransactionsRole.view],
    },
  },
  {
    path: 'download',
    component: CollectionsDownloadComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [collectionTransactionsRole.view],
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionsRoutingModule {}
