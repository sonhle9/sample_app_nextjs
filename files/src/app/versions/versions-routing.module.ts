import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {maintenanceRole} from '../../shared/helpers/roles.type';
import {AppVersionDetailsComponent} from './pages/app-version-details.component';
import {AppVersionListingComponent} from './pages/app-version-listing.component';

const routes: Routes = [
  {
    path: '',
    component: AppVersionListingComponent,
    data: {
      roles: [maintenanceRole.maintenanceVersionView],
    },
  },
  {
    path: 'details/:id',
    component: AppVersionDetailsComponent,
    data: {
      roles: [maintenanceRole.maintenanceVersionView],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VersionsRoutingModule {}
