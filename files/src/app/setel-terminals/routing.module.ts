import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {setelTerminalRoles} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {TerminalsDetailsComponent} from './components/terminal-details.component';
import {TerminalsInventoryComponent} from './components/terminals-inventory.component';
import {TerminalsListingTabComponent} from './components/terminals-listing-tab.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthResolver],
    data: {
      roles: [setelTerminalRoles.devices_view, setelTerminalRoles.inventory_view],
    },
    children: [
      {
        path: 'devices',
        redirectTo: 'devices/setel',
      },
      {
        path: 'devices/:tab',
        component: TerminalsListingTabComponent,
      },
      {
        path: 'details/setel/:serialNum',
        component: TerminalsDetailsComponent,
      },
      {
        path: 'inventory',
        component: TerminalsInventoryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetelTerminalsRoutingModule {}
