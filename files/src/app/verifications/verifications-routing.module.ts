import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {verificationRoles} from 'src/shared/helpers/roles.type';
// import {adminRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {VerificationDetailsComponent} from './pages/verifications-details.component';
import {VerificationsListingComponent} from './pages/verifications-list.component';

const routes: Routes = [
  {
    path: '',
    component: VerificationsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [verificationRoles.view, verificationRoles.update],
      // roles: [adminRole.userMenu],
    },
  },
  {
    path: ':id',
    component: VerificationDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [verificationRoles.view, verificationRoles.update],
      // roles: [adminRole.userMenu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificationsRoutingModule {}
