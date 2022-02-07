import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {subsidyClaimFilesRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../../auth.guard';
import {SubsidyClaimFilesComponent} from './components/claim-files.component';

const routes: Routes = [
  {
    path: '',
    component: SubsidyClaimFilesComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [subsidyClaimFilesRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubsidyClaimFileRoutingModule {}
