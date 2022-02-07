import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {cardPinMailer} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {CardPinMailerDetailsComponent} from './card-pin-mailer-details.component';
import {CardPinMailerListComponent} from './card-pin-mailer-list.component';

const routes: Routes = [
  {
    path: 'card-pin-mailer',
    canActivate: [AuthResolver],
    component: CardPinMailerListComponent,
    data: {
      roles: [cardPinMailer.view],
    },
  },
  {
    path: 'card-pin-mailer/:id',
    canActivate: [AuthResolver],
    component: CardPinMailerDetailsComponent,
    data: {
      roles: [cardPinMailer.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardPinMailerRoutingModule {}
