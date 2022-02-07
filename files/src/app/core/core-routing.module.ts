import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CoreComponent} from './pages/core/core';
import {UnauthorizedComponent} from './pages/unauthorized/unauthorized';

const routes: Routes = [
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: 'accounts',
        loadChildren: () => import('../customers/customers.module').then((m) => m.CustomersModule),
      },
      {
        path: 'customers',
        loadChildren: () => import('../customers/customers.module').then((m) => m.CustomersModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'stations',
        loadChildren: () => import('../stations/stations.module').then((m) => m.StationsModule),
      },
      {
        path: 'retail/fuel-orders',
        loadChildren: () => import('../orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'orders',
        redirectTo: 'retail/fuel-orders',
      },
      {
        path: 'fuel-report/download',
        redirectTo: 'retail/fuel-orders/report/download',
      },
      {
        path: 'retail/fuel-order-recoveries',
        loadChildren: () =>
          import('../fuel-recovery/fuel-recovery.module').then((m) => m.FuelRecoveryModule),
      },
      {
        path: 'fuel-recovery',
        redirectTo: 'retail/fuel-order-recoveries',
      },
      {
        path: 'store-orders',
        loadChildren: () =>
          import('../store/store-orders/store-orders.module').then((m) => m.StoreOrdersModule),
      },
      {
        path: 'stores',
        loadChildren: () => import('../stores/stores.module').then((m) => m.StoresModule),
      },
      {
        path: 'waiting-areas',
        loadChildren: () =>
          import('../waiting-areas/waiting-areas.module').then((m) => m.WaitingAreasModule),
      },
      {
        path: 'external-orders',
        loadChildren: () =>
          import('../external-orders/external-orders.module').then((m) => m.ExternalOrdersModule),
      },
      {
        path: 'wallet',
        loadChildren: () => import('../wallet/wallet.module').then((m) => m.WalletModule),
      },
      {
        path: 'loyalty',
        loadChildren: () => import('../loyalty/loyalty.module').then((m) => m.LoyaltyModule),
      },
      {
        path: 'loyalty-affliate',
        loadChildren: () =>
          import('../loyalty/loyalty-affliate.module').then((m) => m.LoyaltyAffliateModule),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'landing-dashboard',
        loadChildren: () =>
          import('../landing-dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'outage',
        loadChildren: () => import('../outage/outage.module').then((m) => m.OutageModule),
      },
      {
        path: 'gifts',
        loadChildren: () => import('../vouchers/vouchers.module').then((m) => m.VouchersModule),
      },
      {
        path: 'vouchers',
        loadChildren: () => import('../vouchers/vouchers.module').then((m) => m.VouchersModule),
      },
      {
        path: 'versions',
        loadChildren: () => import('../versions/versions.module').then((m) => m.VersionsModule),
      },
      {
        path: 'rewards',
        loadChildren: () => import('../rewards/rewards.module').then((m) => m.RewardsModule),
      },
      {
        path: 'deals',
        loadChildren: () => import('../deal/deal.module').then((m) => m.DealModule),
      },
      {
        path: 'fuelling',
        loadChildren: () => import('../fuelling/fuelling.module').then((m) => m.FuellingModule),
      },
      {
        path: 'merchants',
        loadChildren: () => import('../merchants/merchants.module').then((m) => m.MerchantsModule),
      },
      {
        path: 'devices',
        loadChildren: () => import('../devices/devices.module').then((m) => m.DevicesModule),
      },
      {
        path: 'receivables',
        loadChildren: () =>
          import('../ledger/pages/receivables/receivables.module').then((m) => m.ReceivablesModule),
      },
      {
        path: 'payouts',
        loadChildren: () =>
          import('../ledger/pages/payouts/payouts.module').then((m) => m.PayoutsModule),
      },
      {
        path: 'treasury',
        loadChildren: () => import('../ledger/ledger.module').then((m) => m.LedgerModule),
      },
      {
        path: 'ledger-transactions',
        loadChildren: () =>
          import('../ledger/pages/ledger-transactions/ledger-transactions.module').then(
            (m) => m.LedgerTransactionsModule,
          ),
      },
      {
        path: 'payments',
        loadChildren: () => import('../payments/payments.module').then((m) => m.PaymentsModule),
      },
      {
        path: 'subsidy',
        loadChildren: () => import('../subsidies/subsidies.module').then((m) => m.SubsidiesModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../ledger/pages/reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'prefunding-balance',
        loadChildren: () =>
          import('../prefunding-balance/prefunding-balance.module').then(
            (m) => m.PrefundingBalanceModule,
          ),
      },
      {
        path: 'adjustments',
        loadChildren: () =>
          import('../adjustments/adjustments.module').then((m) => m.AdjustmentsModule),
      },
      {
        path: 'ledger-adjustments',
        loadChildren: () =>
          import('../ledger/pages/adjustments/ledger-adjustments.module').then(
            (m) => m.LedgerAdjustmentsModule,
          ),
      },
      {
        path: 'risk-controls',
        loadChildren: () =>
          import('../fraud-profile/fraud-profile.module').then((m) => m.FraudProfileModule),
      },
      {
        path: 'buy-now-pay-later',
        loadChildren: () =>
          import('../buy-now-pay-later/buy-now-pay-later.module').then(
            (m) => m.BuyNowPayLaterModule,
          ),
      },
      {
        path: 'verifications',
        loadChildren: () =>
          import('../verifications/verifications.module').then((m) => m.VerificationsModule),
      },
      {
        path: 'approvals',
        loadChildren: () => import('../approvers/approvers.module').then((m) => m.ApproversModule),
      },
      {
        path: 'approvals',
        loadChildren: () =>
          import('../approval-rules/approval-rules.module').then((m) => m.ApprovalRulesModule),
      },
      {
        path: 'approvals',
        loadChildren: () =>
          import('../approval-requests/approval-requests.module').then(
            (m) => m.ApprovalRequestsModule,
          ),
      },
      {
        path: 'card-issuing',
        loadChildren: () => import('../cards/cards.module').then((m) => m.CardsModule),
      },
      {
        path: 'card-issuing',
        loadChildren: () =>
          import('../cardholders/cardholders.module').then((m) => m.CardholdersModule),
      },
      {
        path: 'card-issuing',
        loadChildren: () =>
          import('../card-groups/card-groups.module').then((m) => m.CardGroupsModule),
      },
      {
        path: 'card-issuing',
        loadChildren: () =>
          import('../card-range/card-range.module').then((m) => m.CardRangeModule),
      },
      {
        path: 'card-issuing',
        loadChildren: () =>
          import('../card-transactions/card-transactions.module').then(
            (m) => m.CardTransactionsModule,
          ),
      },
      {
        path: 'card-issuing',
        loadChildren: () =>
          import('../card-expiration-date/card-expiry-date.module').then(
            (m) => m.CardExpiryDateModule,
          ),
      },
      {
        path: 'card-issuing',
        loadChildren: () =>
          import('../card-reports/card-reports.module').then((m) => m.CardReportsModule),
      },
      {
        path: 'card-issuing',
        loadChildren: () =>
          import('../card-pin-mailer/card-pin-mailer.module').then((m) => m.CardPinMailerModule),
      },
      {
        path: 'fee-settings',
        loadChildren: () =>
          import('../ledger/pages/fee-settings/fee-settings.module').then(
            (m) => m.FeeSettingsModule,
          ),
      },
      {
        path: 'gamification',
        loadChildren: () =>
          import('../gamification/gamification.module').then((m) => m.GamificationModule),
      },
      {
        path: 'experience',
        loadChildren: () =>
          import('../personalization/personalization.module').then((m) => m.PersonalizationModule),
      },
      {
        path: 'companies',
        loadChildren: () => import('../companies/companies.module').then((m) => m.CompaniesModule),
      },
      {
        path: 'vehicle',
        loadChildren: () => import('../vehicles/vehicles.module').then((m) => m.VehiclesModule),
      },
      {
        path: 'vehicle-directory',
        loadChildren: () =>
          import('../vehicle-directory/vehicle-directory.module').then(
            (m) => m.VehicleDirectoryModule,
          ),
      },
      {
        path: 'general-ledger',
        loadChildren: () =>
          import('../general-ledger/general-ledger.module').then((m) => m.GeneralLedgerModule),
      },
      {
        path: 'general-ledger-rectification',
        loadChildren: () =>
          import('../general-ledger-rectification/general-ledger-rectification.module').then(
            (m) => m.GeneralLedgerRectificationModule,
          ),
      },
      {
        path: 'attribution',
        loadChildren: () =>
          import('../attribution/attribution.module').then((m) => m.AttributionModule),
      },
      {
        path: 'general-ledger-payouts',
        loadChildren: () =>
          import('../general-ledger-payouts/general-ledger-payouts.module').then(
            (m) => m.GeneralLedgerPayoutsModule,
          ),
      },
      {
        path: 'treasury-reports',
        loadChildren: () =>
          import('../treasury-reports/treasury-reports.module').then(
            (m) => m.TreasuryReportsModule,
          ),
      },
      {
        path: 'treasury-reports/mt940',
        loadChildren: () =>
          import('../mt940-reports/mt940-reports.module').then((m) => m.MT940ReportsModule),
      },
      {
        path: 'on-demand-reports',
        loadChildren: () =>
          import('../on-demand-reports/on-demand-reports.module').then(
            (m) => m.OnDemandReportsModule,
          ),
      },
      {
        path: 'snapshot-reports',
        loadChildren: () =>
          import('../snapshot-reports/snapshot-reports.module').then(
            (m) => m.SnapshotReportsModule,
          ),
      },
      {
        path: 'admin-users',
        loadChildren: () =>
          import('../admin-users/admin-users.module').then((m) => m.AdminUsersModule),
      },
      {
        path: 'calendars',
        loadChildren: () =>
          import('../calendar/calendar-admin.module').then((m) => m.CalendarAdminModule),
      },
      {
        path: 'custom-field-rules',
        loadChildren: () =>
          import('../custom-field-rules/custom-field-rules.module').then(
            (m) => m.CustomFieldRulesModule,
          ),
      },
      {
        path: 'gateway',
        loadChildren: () => import('../gateway/gateway.module').then((m) => m.GatewayModule),
      },
      {
        path: 'pricing',
        loadChildren: () => import('../pricing/pricing.module').then((m) => m.PricingModule),
      },
      {
        path: 'merchant-types',
        loadChildren: () =>
          import('../merchant-types/merchant-types.module').then((m) => m.MerchantTypesModule),
      },
      {
        path: 'merchant-links',
        loadChildren: () =>
          import('../merchant-links/merchant-links.module').then((m) => m.MerchantLinksModule),
      },
      {
        path: 'merchant-users',
        loadChildren: () =>
          import('../merchant-users/merchant-users.module').then((m) => m.MerchantUsersModule),
      },
      {
        path: 'bills-reloads',
        loadChildren: () =>
          import('../bills-reloads/bills-reloads.module').then((m) => m.BillsReloadsModule),
      },
      {
        path: 'billing',
        loadChildren: () => import('../billing/billing.module').then((m) => m.BillingModule),
      },
      {
        path: 'sap-posting-history',
        loadChildren: () =>
          import('../sap-posting-history/sap-posting-history.module').then(
            (m) => m.SAPPostingHistoryModule,
          ),
      },
      {
        path: 'user',
        loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'checkout',
        loadChildren: () => import('../checkout/checkout.module').then((m) => m.CheckoutModule),
      },
      {
        path: 'parking-affiliate',
        loadChildren: () =>
          import('../parking/parking-affiliate.module').then((m) => m.ParkingAffiliateModule),
      },
      {
        path: 'circles' /** setelshare */,
        loadChildren: () =>
          import('../setelshare/setelshare.module').then((m) => m.SetelShareModule),
      },
      {
        path: 'terminal',
        loadChildren: () =>
          import('../setel-terminals/setel-terminals.module').then((m) => m.SetelTerminalsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
