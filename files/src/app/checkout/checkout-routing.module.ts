import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {transactionRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import CheckoutComponent from './page/index.checkout';
import {SessionsComponent} from './sessions/sessions';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
    children: [
      {
        path: 'sessions/:id',
        component: SessionsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
