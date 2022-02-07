import {NgModule} from '@angular/core';
import {YesNoPipe} from './yes-no.pipe';
import {LastCharPipe} from './last-char.pipe';
import {TxnStatusPipe} from './txn-status.pipe';
import {ActiveStatusPipe} from './active-status.pipe';
import {RangePipe} from './range.pipe';
import {EmptyDashPipe} from './empty-dash.pipe';
import {LatLngPipe} from './lat-lng.pipe';
import {SetelAcceptedForPipe} from './setel-accepted-for.pipe';
import {StationStatusPipe} from './station-status.pipe';
import {MyrCurrencyPipe} from './myr-currency.pipe';
import {OrderTypePipe} from './order-type.pipe';
import {OrderStatusCssPipe} from './order-status-css.pipe';
import {PaginationCountPipe} from './pagination-count.pipe';
import {LowerCasePipe, TitleCasePipe, UpperCasePipe} from '@angular/common';
import {EmptyObjectPipe} from './empty-object.pipe';
import {PetrolBrandPipe} from './petrol-brand.pipe';
import {TxnStatusCssPipe} from './txn-status-css.pipe';
import {TxnErrorMessagePipe} from './txn-error-message.pipe';
import {PluralPipe} from './plural.pipe';
import {PrefixPipe} from './prefix.pipe';
import {TopUpMethodPipe} from './top-up-method.pipe';
import {TopUpRemarkPipe} from './top-up-remark.pipe';
import {PumpCountPipe} from './pump-count.pipe';
import {JoinPipe} from './join.pipe';
import {EntriesPipe} from './entries.pipe';
import {OrderStatusPipe} from './order-status.pipe';
import {TxnTypePipe} from './txn-type.pipe';
import {DashboardOrderStatusPipe} from './dashboard-order-status.pipe';
import {DashboardTxnStatusPipe} from './dashboard-txn-status.pipe';
import {NotAvailablePipe} from './not-available.pipe';
import {LoyaltyTxnStatusCssPipe} from './loyalty-txn-status-css.pipe';
import {LoyaltyTxnIssuedBy} from './loyalty-txn-issued-by.pipe';
import {CustomerIdentityTypePipe} from './customer-identity-type.pipe';
import {OnOffPipe} from './on-off.pipe';
import {LanguagePipe} from './language.pipe';
import {LoyaltyCardTypePipe} from './loyalty-card-type';
import {LoyaltyCardStatusPipe} from './loyalty-card-status';
import {LoyaltyCardVendorStatusPipe} from './loyalty-card-vendor-status';
import {LoyaltyTxnPointBalancePipe} from './loyalty-txn-point-balance';
import {TransactionErrorPipe} from './transaction-error.pipe';
import {DateAgoPipe} from './date-ago.pipe';
import {StoreOrderStatusCssPipe} from './store-order-status-css.pipe';
import {StoreOrderStatusPipe} from './store-order-status.pipe';
import {FuelTypePipe} from './fuel-type.pipe';
import {StoreStatusPipe} from './store-status.pipe';
import {FuelInCarStatusPipe} from './fuel-in-car-status.pipe';
import {PaymentMethodPipe} from './payment-method.pipe';
import {StoreOrderPosTypePipe} from './store-order-pos-type.pipe';
import {StringFilterByPipe} from './string-filter-by.pipe';
import {LedgerAccountsPipe} from './ledger-accounts-pipe';
import {PayoutBatchStatusCssPipe} from './payout-batch-status-css.pipe';
import {FraudProfilesRestrictionTypePipe} from './fraud-profiles-restriction-type.pipe';
import {FraudProfilesStatusPipe} from './fraud-profiles-status.pipe';
import {FraudProfilesTargetTypePipe} from './fraud-profiles-target-type.pipe';
import {FilterArrayPipe} from './filter-array.pipe';
import {PaymentProcessorPipe} from './payment-processor.pipe';
import {BankNamePipe} from './bank.pipe';
import {ReplacePipe} from './replace.pipe';
import {SecurityProtocolPipe} from './security-protocol.pipe';
import {SkipNaPipe} from './skip-na.pipe';
import {OmitPipe} from './omit.pipe';
import {AllowFuelProductPipe} from './allow-fuel-product.pipe';
import {ConciergeOrderStatusCssPipe} from './concierge-order-status-css.pipe';
import {ConciergeOrderStatusPipe} from './concierge-order-status.pipe';
import {checkoutTransactionStatusPipe} from './checkout-transaction-status.pipe';
import {checkoutTransactionPaymentMethodPipe} from './checkout-transaction-payment-method.pipe';

@NgModule({
  declarations: [
    YesNoPipe,
    LastCharPipe,
    TxnStatusPipe,
    ActiveStatusPipe,
    FilterArrayPipe,
    RangePipe,
    EmptyDashPipe,
    LatLngPipe,
    SetelAcceptedForPipe,
    StationStatusPipe,
    MyrCurrencyPipe,
    OrderStatusCssPipe,
    OrderTypePipe,
    StoreOrderStatusCssPipe,
    ConciergeOrderStatusCssPipe,
    ConciergeOrderStatusPipe,
    StoreOrderStatusPipe,
    PaginationCountPipe,
    EmptyObjectPipe,
    PetrolBrandPipe,
    TxnStatusCssPipe,
    TxnErrorMessagePipe,
    TopUpMethodPipe,
    TopUpRemarkPipe,
    PluralPipe,
    PrefixPipe,
    PumpCountPipe,
    JoinPipe,
    EntriesPipe,
    OrderStatusPipe,
    TxnTypePipe,
    DashboardOrderStatusPipe,
    DashboardTxnStatusPipe,
    NotAvailablePipe,
    LoyaltyTxnStatusCssPipe,
    LoyaltyTxnIssuedBy,
    CustomerIdentityTypePipe,
    OnOffPipe,
    LanguagePipe,
    LoyaltyCardTypePipe,
    LoyaltyCardStatusPipe,
    LoyaltyCardVendorStatusPipe,
    LoyaltyTxnPointBalancePipe,
    TransactionErrorPipe,
    DateAgoPipe,
    FuelTypePipe,
    StoreStatusPipe,
    PaymentMethodPipe,
    StoreOrderPosTypePipe,
    StringFilterByPipe,
    FuelInCarStatusPipe,
    LedgerAccountsPipe,
    PayoutBatchStatusCssPipe,
    FraudProfilesRestrictionTypePipe,
    FraudProfilesStatusPipe,
    FraudProfilesTargetTypePipe,
    PaymentProcessorPipe,
    BankNamePipe,
    ReplacePipe,
    SecurityProtocolPipe,
    SkipNaPipe,
    OmitPipe,
    AllowFuelProductPipe,
    checkoutTransactionStatusPipe,
    checkoutTransactionPaymentMethodPipe,
  ],
  exports: [
    YesNoPipe,
    FilterArrayPipe,
    LastCharPipe,
    TxnStatusPipe,
    ActiveStatusPipe,
    RangePipe,
    EmptyDashPipe,
    LatLngPipe,
    SetelAcceptedForPipe,
    StationStatusPipe,
    MyrCurrencyPipe,
    OrderStatusCssPipe,
    OrderTypePipe,
    StoreOrderStatusCssPipe,
    ConciergeOrderStatusCssPipe,
    ConciergeOrderStatusPipe,
    StoreOrderStatusPipe,
    PaginationCountPipe,
    EmptyObjectPipe,
    PetrolBrandPipe,
    TxnStatusCssPipe,
    TxnErrorMessagePipe,
    TopUpMethodPipe,
    TopUpRemarkPipe,
    PluralPipe,
    PrefixPipe,
    PumpCountPipe,
    JoinPipe,
    EntriesPipe,
    OrderStatusPipe,
    TxnTypePipe,
    DashboardOrderStatusPipe,
    DashboardTxnStatusPipe,
    NotAvailablePipe,
    LoyaltyTxnStatusCssPipe,
    LoyaltyTxnIssuedBy,
    CustomerIdentityTypePipe,
    OnOffPipe,
    LanguagePipe,
    LoyaltyCardTypePipe,
    LoyaltyCardStatusPipe,
    LoyaltyCardVendorStatusPipe,
    LoyaltyTxnPointBalancePipe,
    TransactionErrorPipe,
    DateAgoPipe,
    FuelTypePipe,
    StoreStatusPipe,
    PaymentMethodPipe,
    StoreOrderPosTypePipe,
    StringFilterByPipe,
    FuelInCarStatusPipe,
    LedgerAccountsPipe,
    PayoutBatchStatusCssPipe,
    FraudProfilesRestrictionTypePipe,
    FraudProfilesStatusPipe,
    FraudProfilesTargetTypePipe,
    PaymentProcessorPipe,
    BankNamePipe,
    ReplacePipe,
    SecurityProtocolPipe,
    SkipNaPipe,
    OmitPipe,
    AllowFuelProductPipe,
    checkoutTransactionStatusPipe,
    checkoutTransactionPaymentMethodPipe,
  ],
  providers: [
    TitleCasePipe,
    UpperCasePipe,
    LowerCasePipe,
    PetrolBrandPipe,
    PaymentMethodPipe,
    PaymentProcessorPipe,
  ],
})
export class PipesModule {}
