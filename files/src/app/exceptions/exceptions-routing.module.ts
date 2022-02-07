import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {exceptionsRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {ExceptionDetailsComponent} from './pages/exception-details.component';
import {ExceptionListingComponent} from './pages/exception-listing.component';
import {ExceptionsComponent} from './pages/exceptions.component';

const routes: Routes = [
  {
    path: '',
    component: ExceptionsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [exceptionsRole.view],
    },
    children: [
      {
        path: '',
        component: ExceptionListingComponent,
      },
      {
        path: ':id',
        component: ExceptionDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExceptionsRoutingModule {}
