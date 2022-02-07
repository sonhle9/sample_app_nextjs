import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MomentModule} from 'ngx-moment';
import {ComponentsModule} from '../../shared/components/components.module';
import {PromptDialogComponent} from '../../shared/components/prompt-dialog/prompt-dialog.component';
import {MaterialModule} from '../../shared/material/material.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {FraudProfileModule} from '../fraud-profile/fraud-profile.module';
import {FraudProfileModalComponent} from '../fraud-profile/pages/fraud-profile-modal/fraudProfileModal.component';
import {OrdersModule} from '../orders/orders.module';
import {AddTopupTransactionComponent} from './components/addTopupTransaction/addTopupTransaction';
import {GrantPointsComponent} from './components/grantPoints/grantPoints';
import {GrantWalletComponent} from './components/grantWallet/grantWallet';
import {JsonPopupComponent} from './components/json-popup/json-popup.component';
import {CustomersRoutingModule} from './customers-routing.module';
import {CustomerRetailExternalOrdersComponent} from './pages/customer-external-orders/customer-external-retail-orders.component';
import {CustomerStatementModalComponent} from './pages/customer-statement-modal/customer-statement-modal.component';
import {CustomerAutoTopupComponent} from './pages/customerAutoTopup/customerAutoTopup';
import {CustomerCheckoutTransactionsComponent} from './pages/customerCheckoutTransactions/customerCheckoutTransactions';
import {CustomerCreditCardsComponent} from './pages/customerCreditCards/customerCreditCards';
import {CustomerDetailsComponent} from './pages/customerDetails/customerDetails';
import {CustomerExpiringWalletBalanceComponent} from './pages/customerExpiringWalletBalance/customerExpiringWalletBalance';
import {CustomerFraudProfileAlertComponent} from './pages/customerFraudProfileAlert/customerFraudProfileAlert.component';
import {CustomerIncomingTransactionsComponent} from './pages/customerIncomingTransactions/customerIncomingTransactions';
import {CustomerLmsTransactionsComponent} from './pages/customerLmsLoyaltyTransactions/customerLmsTransactions';
import {CustomerLoyaltyCardDetailsComponent} from './pages/customerLoyaltyCardDetails/customerLoyaltyCardDetails';
import {CustomerLoyaltyCardsComponent} from './pages/customerLoyaltyCards/customerLoyaltyCards';
import {CustomerLoyaltyExpiryComponent} from './pages/customerLoyaltyExpiry/customerLoyaltyExpiry';
import {CustomerLoyaltyUnlinkHistoryComponent} from './pages/customerLoyaltyUnlinkHistory/customerLoyaltyUnlinkHistory';
import {CustomerPaymentVendorTransactionsComponent} from './pages/customerPaymentVendorTransactions/customerPaymentVendorTransactions.component';
import {CustomersComponent} from './pages/customers/customers.component';
import {CustomerStoreOrdersComponent} from './pages/customerStoreOrders/customerStoreOrders';
import {CustomerTopupsComponent} from './pages/customerTopups/customerTopups';
import {CustomerVehicleListingComponent} from './pages/customerVehicle/customer-vehicle-listing.component';
import {CustomerBadgesComponent} from './pages/customer-badges/customer-badges';
import {GrantPointsModalComponent} from './pages/grant-points-modal/grant-points-modal.component';
import {MatTabsModule} from '@angular/material/tabs';
import {CustomerDashboardComponent} from './pages/customerDashboard/customerDashboard.component';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {CustomerDeliver2meOrdersComponent} from './pages/customer-deliver2me-orders/customer-deliver2me-orders.component';
import {CustomerAccountDetailsComponent} from './pages/customerAccountDetails/customerAccountDetails.component';
import {CustomerFuelOrdersComponent} from './pages/customer-fuel-orders/customer-fuel-orders.component';
import {CustomerMembershipComponent} from './pages/customer-membership/customer-membership';
import {CustomerTopUpBetaComponent} from '././pages/customer-top-ups-and-payment/customer-topUps';
import {CustomerFuelBudget} from './pages/customerBudget/customerBudget';
import {CustomerRewardsComponent} from './pages/customer-rewards/customer-rewards';
import {GoalDetailsComponent} from './pages/goal-details/goal-details';
import {CustomerVouchersComponent} from './pages/customer-vouchers/customer-vouchers';
import {CustomerLoyaltyComponent} from './pages/customer-loyalty/customer-loyalty';
import {CustomerDataPlatformComponent} from './pages/customer-data-platform/customer-data-platform';
import {CustomerWalletTransactionsComponent} from './pages/customer-wallet-transactions/customer-wallet-transactions.component';
import {CustomerFraudProfileComponent} from './pages/customer-fraud-profile/customer-fraud-profile';
import {CustomerCardDetailsComponent} from './pages/customer-card-details/customer-card-details';
import {CustomerRiskProfileComponent} from './pages/customer-risk-profile/customer-risk-profile';
import {CustomerSetelShareComponent} from './pages/customerSetelShare/customer-setelshare-component';
import {CustomerTreasuryComponent} from './pages/customerTreasury/customer-treasury-component';

@NgModule({
  declarations: [
    CustomersComponent,
    CustomerDetailsComponent,
    CustomerCheckoutTransactionsComponent,
    CustomerCreditCardsComponent,
    CustomerLoyaltyCardsComponent,
    CustomerLoyaltyExpiryComponent,
    CustomerLoyaltyCardDetailsComponent,
    CustomerLmsTransactionsComponent,
    CustomerTopupsComponent,
    AddTopupTransactionComponent,
    CustomerAutoTopupComponent,
    GrantWalletComponent,
    GrantPointsComponent,
    CustomerPaymentVendorTransactionsComponent,
    JsonPopupComponent,
    CustomerBadgesComponent,
    CustomerLoyaltyUnlinkHistoryComponent,
    CustomerIncomingTransactionsComponent,
    CustomerStoreOrdersComponent,
    CustomerStatementModalComponent,
    CustomerRetailExternalOrdersComponent,
    CustomerExpiringWalletBalanceComponent,
    CustomerCardDetailsComponent,
    GrantPointsModalComponent,
    CustomerFraudProfileComponent,
    CustomerFraudProfileAlertComponent,
    CustomerVehicleListingComponent,
    PromptDialogComponent,
    CustomerDashboardComponent,
    CustomerDeliver2meOrdersComponent,
    CustomerAccountDetailsComponent,
    CustomerFuelOrdersComponent,
    CustomerMembershipComponent,
    CustomerTopUpBetaComponent,
    CustomerFuelBudget,
    CustomerRewardsComponent,
    GoalDetailsComponent,
    CustomerVouchersComponent,
    CustomerLoyaltyComponent,
    CustomerDataPlatformComponent,
    CustomerWalletTransactionsComponent,
    CustomerCardDetailsComponent,
    CustomerRiskProfileComponent,
    CustomerSetelShareComponent,
    CustomerTreasuryComponent,
  ],
  entryComponents: [
    JsonPopupComponent,
    CustomerStatementModalComponent,
    GrantPointsModalComponent,
    FraudProfileModalComponent,
    PromptDialogComponent,
  ],
  imports: [
    MomentModule,
    PipesModule,
    MaterialModule,
    ComponentsModule,
    CustomersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OrdersModule,
    NgxJsonViewerModule,
    NgxDatatableModule,
    FlexLayoutModule,
    FraudProfileModule,
    MatTabsModule,
    DirectivesModule,
  ],
})
export class CustomersModule {}
