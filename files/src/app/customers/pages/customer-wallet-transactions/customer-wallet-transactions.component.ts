import {Component, Input} from '@angular/core';
import {CustomerWalletTransactions} from 'src/react/modules/customers';

@Component({
  selector: 'app-customer-wallet-transactions',
  template:
    '<div class="mt-10" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerWalletTransactionsComponent {
  @Input()
  customerId;
  reactComponent = CustomerWalletTransactions;
}
