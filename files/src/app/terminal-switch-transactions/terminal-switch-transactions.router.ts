import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TerminalSwitchTransactionComponent} from './components/terminal-switch-transactions.component';
import {TerminalSwitchTransactionListingComponent} from './components/terminal-switch-transactions-listing.component';
import {TerminalSwitchTransactionDetailComponent} from './components/terminal-switch-transactions-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TerminalSwitchTransactionComponent,
    children: [
      {
        path: '',
        component: TerminalSwitchTransactionListingComponent,
      },
      {
        path: ':transactionId',
        component: TerminalSwitchTransactionDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalSwitchTransactionRouter {}
