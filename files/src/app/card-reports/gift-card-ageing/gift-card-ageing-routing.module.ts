import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from 'src/app/auth.guard';
import {cardReportAccess} from 'src/shared/helpers/pdb.roles.type';
import {GiftCardAgeingListComponent} from './gift-card-ageing-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthResolver],
    component: GiftCardAgeingListComponent,
    data: {
      roles: [cardReportAccess.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftCardAgeingRoutingModule {}
