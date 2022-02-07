import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {gatewayAccess} from 'src/shared/helpers/pdb.roles.type';
import {AuthResolver} from '../auth.guard';
import {TerminalComponent} from './components/terminals.component';
import {TerminalsListingComponent} from './components/terminals-listing.component';
import {TerminalsDetailsComponent} from './components/terminals-details.component';

const routes: Routes = [
  {
    path: '',
    component: TerminalComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [gatewayAccess.admin_gateway_legacy_terminals_view],
    },
    children: [
      {
        path: '',
        component: TerminalsListingComponent,
      },
      {
        path: ':terminalId/merchants/:merchantId',
        component: TerminalsDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalsRoutingModule {}
