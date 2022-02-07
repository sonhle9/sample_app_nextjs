import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {
  isDefined,
  PortalAttributionIcon,
  PortalBillingsIcon,
  PortalBillsAndReloadIcons,
  PortalCardIssuingIcon,
  PortalCirclesIcon,
  PortalCompaniesIcon,
  PortalComplianceIcon,
  PortalCustomersIcon,
  PortalDealsIcon,
  PortalDevicesIcon,
  PortalExperienceIcon,
  PortalFraudControlsIcon,
  PortalFuellingIcon,
  PortalGamificationIcon,
  PortalGatewayIcon,
  PortalGiftsIcon,
  PortalHomeIcon,
  PortalLoyaltyAffiliateIcon,
  PortalLoyaltyIcon,
  PortalMaintenanceIcon,
  PortalMerchantsIcon,
  PortalMiniAppIcon,
  PortalPaymentsIcon,
  PortalPricingIcon,
  PortalReportsIcon,
  PortalRetailIcon,
  PortalRewardsIcon,
  PortalTeamsIcon,
  PortalTerminalsIcon,
  PortalTreasuryIcon,
  PortalVehicleDirectoryIcon,
  PortalVehiclesIcon,
  PortalWalletIcon,
  PortalWebhooksIcon,
  PortalParkingIcon,
} from '@setel/portal-ui';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import * as pdbRoles from 'src/shared/helpers/pdb.roles.type';
import {
  adjustmentRoles,
  adminAccountRole,
  adminFraudProfile,
  adminRiskProfile,
  adminRole,
  attributionRoles,
  badgeCampaignsRoles,
  billingCreditNotesRoles,
  billingInvoicesRole,
  billingPlansRole,
  // billingSubscriptionsRole,
  billingStatementSummaryRoles,
  billsAndReloadsRoles,
  calendarAdminRole,
  cardExpirationRole,
  cardGroupRole,
  cardHolderRole,
  cardPinMailer,
  cardRangeRole,
  cardRole,
  cardTransactionRole,
  chargesRoles,
  collectionTransactionsRole,
  customerRole,
  customFieldRuleRole,
  dealRole,
  deviceRole,
  exceptionsRole,
  experienceAppSettingsRoles,
  extVouchersReportRole,
  feePlansRole,
  feeSettingsRole,
  feesTransactionRole,
  ledgerRole,
  loyaltyRoles,
  maintenanceRole,
  merchantRole,
  merchantUserRole,
  onDemandReportConfigAccess,
  prefundingBalanceRole,
  rebatePlansRole,
  reconciliationRole,
  refundRoles,
  retailRoles,
  rewardsRole,
  setelTerminalRoles,
  settlementRoles,
  terminalSwitchRoles,
  subsidyMaintenanceRole,
  subsidyRateRole,
  topupRefundRoles,
  topupRoles,
  transactionRole,
  transferRoles,
  treasuryReportRole,
  variablesRoles,
  vehicleRole,
  verificationRoles,
  vouchersBatchReportRole,
  vouchersBatchRole,
  vouchersValidateRole,
  subsidyClaimFilesRole,
  rebateReportRole,
  billingReportsRole,
  billingPukalPaymentRole,
  billingPukalSedutRole,
  adminBnplPlanConfig,
  adminBnplAccount,
  // adminBnplBill,
  // adminBnplInstruction,
} from 'src/shared/helpers/roles.type';
import {
  getMerchantTypesUsed,
  MERCHANT_TYPES_UPDATED_STORAGE_KEY,
  MERCHANT_TYPES_USED_STORAGE_KEY,
} from '../../../../react/modules/merchant-types/merchant-types.service';
import {IMerchantTypeUsed} from '../../../../react/modules/merchant-types/merchant-types.type';
import {EnterpriseProducts} from '../../../../shared/enums/enterprise.enum';
import {ISessionData} from '../../../../shared/interfaces/auth.interface';
import {IMenuGroup, IMenuItem, IMenuItemGroup} from '../../../../shared/interfaces/core.interface';
import {ApiMerchantsService} from '../../../api-merchants.service';
import {AuthService} from '../../../auth.service';
import {AppEmitter} from '../../../emitter.service';

/**
 * The config object is used to defined which user's role
 * can be used to access certain menu item.
 * "accessedWith" property helps to define whitelist of roles to have access.
 * Also "accessedWith" property may be defined on sub-menu items to have more detailed control.
 * If "accessedWith" property is omitted role checking is skip too.
 */
const MENU_CONFIG: IMenuGroup[] = [
  {
    text: '',
    items: [{url: '/landing-dashboard', text: 'Dashboard', icon: PortalHomeIcon}],
  },
  {
    text: 'Users',
    items: [
      {
        accessedWith: [customerRole.menu, customerRole.index, adminAccountRole.adminRead],
        url: '/accounts',
        text: 'Accounts',
        icon: PortalCustomersIcon,
      },
    ],
  },
  {
    text: 'Businesses',
    items: [
      {
        text: 'Merchants',
        icon: PortalMerchantsIcon,
        type: 'group',
        items: [
          {
            accessedWith: [merchantRole.view],
            url: '/merchants',
            text: 'All merchants',
          },
        ],
      },
      {
        accessedWith: [adminRole.userMenu],
        url: '/companies',
        text: 'Companies',
        icon: PortalCompaniesIcon,
      },
    ],
  },
  {
    text: 'Hardware',
    items: [
      {
        accessedWith: [deviceRole.view],
        url: '/devices/list',
        text: 'Devices',
        icon: PortalDevicesIcon,
      },
      environment.showBetaPages
        ? {
            accessedWith: [deviceRole.view],
            url: '/devices/listing',
            text: 'Devices (Beta)',
            icon: PortalDevicesIcon,
          }
        : undefined,
    ].filter(Boolean),
  },
  {
    text: 'On-the-go retail',
    items: [
      {
        text: 'Retail',
        icon: PortalRetailIcon,
        type: 'group',
        items: [
          {
            accessedWith: [retailRoles.fuelOrderView],
            text: 'Fuel orders',
            url: '/retail/fuel-orders',
          },
          {
            accessedWith: [retailRoles.fuelOrderRecoveryView],
            text: 'Fuel order recoveries',
            url: '/retail/fuel-order-recoveries/pending',
          },
          {
            accessedWith: [retailRoles.storeOrderView, retailRoles.storeInCarOrderView],
            text: 'Store orders',
            url: '/store-orders',
          },
          {
            accessedWith: [retailRoles.externalOrderView],
            text: 'External orders',
            url: '/external-orders/bulk-update',
          },
          environment.showBetaPages
            ? {
                accessedWith: [retailRoles.externalOrderView],
                text: 'External orders (Beta)',
                url: '/external-orders/bulk-update-beta',
              }
            : undefined,
          {
            accessedWith: [retailRoles.stationView],
            text: 'Stations',
            url: '/stations',
          },
          {
            accessedWith: [retailRoles.storeView],
            text: 'Stores',
            url: '/stores',
          },
          {
            accessedWith: [retailRoles.waitingAreaView],
            text: 'Waiting areas',
            url: '/waiting-areas',
          },
        ].filter(isDefined),
      },
      {
        text: 'Fuelling',
        icon: PortalFuellingIcon,
        type: 'group',
        items: [
          {
            accessedWith: [retailRoles.fuelPriceView],
            text: 'Fuel prices',
            url: '/fuelling/fuel-prices',
          },
        ],
      },
    ],
  },
  {
    text: 'Customer Engagement',
    items: [
      {
        text: 'Loyalty affiliate',
        icon: PortalLoyaltyAffiliateIcon,
        type: 'group',
        items: [
          {
            text: 'Loyalty cards',
            url: '/loyalty-affliate/cards',
            accessedWith: [loyaltyRoles.loyaltyAffliateMenuAccess],
          },
          {
            text: 'Search loyalty cards',
            url: '/loyalty-affliate/search-cards',
            accessedWith: [loyaltyRoles.loyaltyAffliateMenuAccess],
          },
          {
            text: 'Transactions',
            url: '/loyalty-affliate/transactions',
            accessedWith: [loyaltyRoles.loyaltyAffliateMenuAccess],
          },
          {
            text: 'Loyalty transactions',
            url: '/loyalty-affliate/loyalty-transactions',
            accessedWith: [loyaltyRoles.loyaltyAffliateMenuAccess],
          },
          {
            text: 'Daily loyalty transactions',
            url: '/loyalty-affliate/transactions-daily',
            accessedWith: [loyaltyRoles.loyaltyAffliateMenuAccess],
          },
          {
            text: 'Monthly loyalty transactions',
            url: '/loyalty-affliate/transactions-monthly',
            accessedWith: [loyaltyRoles.loyaltyAffliateMenuAccess],
          },
        ],
      },
      {
        text: 'Loyalty',
        icon: PortalLoyaltyIcon,
        type: 'group',
        items: [
          {
            text: 'Members',
            url: '/loyalty/members',
            accessedWith: [loyaltyRoles.loyaltyMembersAdminAccess],
          },
          {
            text: 'Point earnings',
            url: '/loyalty/point-earnings',
            accessedWith: [loyaltyRoles.viewPointTransactions, loyaltyRoles.adminAccess],
          },
          {
            text: 'Point redemptions',
            url: '/loyalty/point-redemptions',
            accessedWith: [loyaltyRoles.viewPointTransactions, loyaltyRoles.adminAccess],
          },
          {
            text: 'Point earning rules',
            url: '/loyalty/point-earning-rules',
            accessedWith: [loyaltyRoles.viewEarningRules, loyaltyRoles.adminAccess],
          },
          {
            text: 'Point redemption rules',
            url: '/loyalty/point-redemption-rules',
            accessedWith: [loyaltyRoles.viewRedemptionRules, loyaltyRoles.adminAccess],
          },
          {
            text: 'Loyalty categories',
            url: '/loyalty/loyalty-categories',
            accessedWith: [loyaltyRoles.viewLoyaltyCategories, loyaltyRoles.adminAccess],
          },
          {
            text: 'Point approval',
            url: '/loyalty/point-approval',
            accessedWith: [loyaltyRoles.viewPointAdjustment, loyaltyRoles.adminAccess],
          },
          {
            text: 'Point expiries',
            url: '/loyalty/point-expiries',
            accessedWith: [loyaltyRoles.viewPointExpiries, loyaltyRoles.adminAccess],
          },
          {
            text: 'Reports',
            url: '/loyalty/reports',
            accessedWith: [loyaltyRoles.viewLoyaltyReports],
          },
        ],
      },
      {
        text: 'Deals',
        icon: PortalDealsIcon,
        type: 'group',
        items: [
          {
            accessedWith: [dealRole.admin_deals_deal_campaign_view],
            text: 'Deal campaigns',
            url: '/deals/deal-campaigns',
          },
          {
            accessedWith: [dealRole.admin_deals_deal_order_view],
            text: 'Deal orders',
            url: '/deals/deal-orders',
          },
          {
            accessedWith: [dealRole.admin_deals_deal_catalogue_view],
            text: 'Deal catalogues',
            url: '/deals/deal-catalogues',
          },
        ],
      },
      {
        text: 'Rewards',
        icon: PortalRewardsIcon,
        type: 'group',
        items: [
          {
            accessedWith: [rewardsRole.admin_rewards_campaign_view],
            text: 'Reward campaigns',
            url: '/rewards/rewards-campaigns',
          },
          {
            accessedWith: [rewardsRole.admin_rewards_campaign_view],
            text: 'Reliability',
            url: '/rewards/rewards-reliability',
          },
          {
            accessedWith: [rewardsRole.admin_rewards_campaign_view],
            text: 'Referral leaderboard',
            url: '/rewards/rewards-referral-leaderboard',
          },
        ].filter(Boolean),
      },
      {
        text: 'Gifts',
        icon: PortalGiftsIcon,
        type: 'group',
        items: [
          {
            accessedWith: [vouchersBatchRole.view],
            text: 'Voucher batches',
            url: '/gifts/voucher-batches',
          },
          environment.showBetaPages && {
            accessedWith: [vouchersBatchRole.view],
            text: 'Voucher batches (Beta)',
            url: '/gifts/voucher-batches/list',
          },
          {
            accessedWith: [vouchersValidateRole.validate],
            text: 'Voucher validations',
            url: '/gifts/voucher-validations',
          },
          environment.showBetaPages && {
            accessedWith: [vouchersValidateRole.validate],
            text: 'Voucher validations (Beta)',
            url: '/gifts/voucher-validations/list',
          },
        ].filter(Boolean),
      },
      {
        text: 'Gamification',
        productKey: EnterpriseProducts.GAMIFICATION,
        icon: PortalGamificationIcon,
        type: 'group',
        items: [
          {
            accessedWith: [badgeCampaignsRoles.menu],
            text: 'Badge campaigns',
            url: '/gamification/badge-campaigns',
          },
        ],
      },
      {
        text: 'Experience',
        productKey: EnterpriseProducts.EXPERIENCE,
        icon: PortalExperienceIcon,
        type: 'group',
        items: [
          {
            accessedWith: [variablesRoles.view],
            text: 'Variables',
            url: '/experience/variables',
          },
          {
            accessedWith: [experienceAppSettingsRoles.menu],
            text: 'Interface components',
            url: '/experience/interface-components',
          },
          environment.showBetaPages
            ? {
                accessedWith: [experienceAppSettingsRoles.menu],
                text: 'Interface components (Beta)',
                url: '/experience/interface-components/new',
              }
            : undefined,
        ].filter(Boolean),
      },
      {
        text: 'Attribution',
        productKey: EnterpriseProducts.ATTRIBUTION,
        icon: PortalAttributionIcon,
        type: 'group',
        items: [
          {
            accessedWith: [attributionRoles.view],
            text: 'Attribution rules',
            url: '/attribution/attribution-rules',
          },
        ],
      },
    ],
  },
  {
    text: 'Reports',
    items: [
      // {
      //   text: 'Weekly Report',
      //   url: '/reports',
      // },
      // {
      //   text: 'Weekly Report: Customer Listing',
      //   url: '/reports',
      // },
      // {
      //   text: 'Customer Funnel',
      //   url: '/reports',
      // },
      {
        accessedWith: [vouchersBatchReportRole.menu],
        text: 'Voucher report',
        url: '/vouchers/batches/report',
        icon: PortalReportsIcon,
      },
      environment.showBetaPages && {
        accessedWith: [vouchersBatchReportRole.menu],
        text: 'Voucher report (Beta)',
        url: '/vouchers/batches/report/list',
        icon: PortalReportsIcon,
      },
      {
        accessedWith: [extVouchersReportRole.menu],
        text: 'E-pay recon',
        url: '/vouchers/ext-vouchers-report/e-pay-recon',
        icon: PortalReportsIcon,
      },
      environment.showBetaPages && {
        accessedWith: [extVouchersReportRole.menu],
        text: 'E-pay recon (Beta)',
        url: '/vouchers/ext-vouchers-report/e-pay-recon/list',
        icon: PortalReportsIcon,
      },
      {
        accessedWith: [ledgerRole.menu],
        url: '/reports/payout-projection',
        text: 'Payout projection',
        icon: PortalReportsIcon,
      },
      {
        accessedWith: [ledgerRole.menu],
        url: '/reports/payables',
        text: 'Payables report',
        icon: PortalReportsIcon,
      },
      {
        accessedWith: [ledgerRole.menu],
        url: '/reports/receivables',
        text: 'Receivables report',
        icon: PortalReportsIcon,
      },
    ].filter(Boolean),
  },
  {
    text: 'Motorist offerings',
    items: [
      {
        accessedWith: [vehicleRole.menu],
        url: '/vehicle',
        text: 'Vehicle',
        icon: PortalVehiclesIcon,
      },
      {
        accessedWith: [vehicleRole.menu],
        url: '/vehicle-directory',
        text: 'Vehicle directory',
        icon: PortalVehicleDirectoryIcon,
      },
      {
        text: 'Parking affiliate (Beta)',
        icon: PortalParkingIcon,
        type: 'group',
        items: [
          CURRENT_ENTERPRISE.name === 'setel' && {
            text: 'Sessions',
            url: 'parking-affiliate/sessions',
          },
          CURRENT_ENTERPRISE.name === 'setel' && {
            text: 'Locations',
            url: 'parking-affiliate/locations',
          },
        ].filter(Boolean),
      },
    ],
  },
  {
    text: 'Financial services',
    items: [
      {
        text: 'Wallet',
        icon: PortalWalletIcon,
        type: 'group',
        items: [
          {
            accessedWith: [topupRoles.view],
            text: 'Top-ups',
            url: '/wallet/topups',
          },
          environment.showBetaPages
            ? {
                accessedWith: [topupRoles.view],
                text: 'Top-ups (Beta)',
                url: '/wallet/topups/listing',
              }
            : undefined,
          {
            accessedWith: [topupRefundRoles.view],
            text: 'Top-up refunds',
            url: '/wallet/topup-refunds',
          },
          environment.showBetaPages
            ? {
                accessedWith: [topupRefundRoles.view],
                text: 'Top-up refunds (Beta)',
                url: '/wallet/topup-refunds/listing',
              }
            : undefined,
          {
            url: '/wallet/wallet-balance-grantings',
            text: 'Wallet balance grantings',
            accessedWith: [adminRole.userMenu],
          },
          environment.showBetaPages
            ? {
                url: '/wallet/wallet-balance-grantings/beta',
                text: 'Wallet balance grantings (Beta)',
                accessedWith: [adminRole.userMenu],
              }
            : undefined,
        ].filter(Boolean),
      },
      {
        text: 'Payments',
        icon: PortalPaymentsIcon,
        type: 'group',
        items: [
          {
            accessedWith: [transactionRole.view],
            text: 'Transactions',
            url: '/payments/transactions',
          },
          environment.showBetaPages
            ? {
                accessedWith: [transactionRole.view],
                text: 'Transactions (Beta)',
                url: '/payments/transactions/listing',
              }
            : undefined,
          {
            accessedWith: [chargesRoles.view],
            text: 'Charges',
            url: '/payments/charges',
          },
          environment.showBetaPages
            ? {
                accessedWith: [chargesRoles.view],
                text: 'Charges (Beta)',
                url: '/payments/charges/listing',
              }
            : undefined,
          {
            accessedWith: [refundRoles.view],
            text: 'Refunds',
            url: '/payments/refunds',
          },
          environment.showBetaPages
            ? {
                accessedWith: [refundRoles.view],
                text: 'Refunds (Beta)',
                url: '/payments/refunds/listing',
              }
            : undefined,
          {
            accessedWith: [transferRoles.view],
            text: 'Transfers',
            url: '/payments/transfers',
          },
          environment.showBetaPages
            ? {
                accessedWith: [transferRoles.view],
                text: 'Transfers (Beta)',
                url: '/payments/transfers/listing',
              }
            : undefined,
          {
            accessedWith: [settlementRoles.view],
            text: 'Settlements',
            url: '/payments/settlements',
          },
          {
            accessedWith: [adjustmentRoles.menu],
            text: 'Adjustments',
            url: '/payments/adjustments',
          },
          environment.showBetaPages
            ? {
                accessedWith: [adjustmentRoles.menu],
                text: 'Adjustments (Beta)',
                url: '/payments/adjustments/listing',
              }
            : undefined,
        ].filter(isDefined),
      },
      {
        text: 'Pricing',
        icon: PortalPricingIcon,
        type: 'group',
        items: [
          {
            accessedWith: [feePlansRole.view],
            url: '/pricing/fee-plans',
            text: 'Fee plans',
          },
          {
            accessedWith: [feesTransactionRole.view],
            url: '/pricing/fees',
            text: 'Fees',
          },
          {
            accessedWith: [collectionTransactionsRole.view],
            url: '/pricing/collections',
            text: 'Collections',
          },
          {
            accessedWith: [feeSettingsRole.view],
            url: '/pricing/fee-settings',
            text: 'Fee settings',
          },
          {
            accessedWith: [rebatePlansRole.view],
            url: '/pricing/rebate-plans',
            text: 'Rebate plans',
          },
          {
            accessedWith: [rebateReportRole.view],
            url: '/pricing/reports',
            text: 'Reports',
          },
        ],
      },
      {
        text: 'Billing',
        icon: PortalBillingsIcon,
        type: 'group',
        items: [
          {
            accessedWith: [billingPlansRole.view],
            url: '/billing/billing-plans',
            text: 'Billing plans',
          },
          // {
          //   accessedWith: [billingSubscriptionsRole.view],
          //   url: '/billing/billing-subscriptions',
          //   text: 'Billing subscriptions',
          // },
          {
            accessedWith: [billingInvoicesRole.view],
            url: '/billing/billing-invoices',
            text: 'Invoices',
          },
          {
            accessedWith: [billingCreditNotesRoles.view],
            url: '/billing/credit-notes',
            text: 'Credit notes',
          },
          {
            accessedWith: [billingPukalPaymentRole.view],
            url: '/billing/pukal-payment',
            text: 'Pukal Payment',
          },
          {
            accessedWith: [billingPukalSedutRole.view],
            url: '/billing/pukal-sedut',
            text: 'Pukal Sedut',
          },
          {
            accessedWith: [billingStatementSummaryRoles.view],
            url: '/billing/statement-summary',
            text: 'Statement summary',
          },
          {
            accessedWith: [billingStatementSummaryRoles.view],
            url: '/billing/statement-account',
            text: 'Account statement',
          },
          {
            accessedWith: [billingReportsRole.view],
            url: '/billing/reports',
            text: 'Reports',
          },
        ],
      },
      {
        text: 'Bills & reloads',
        icon: PortalBillsAndReloadIcons,
        type: 'group',
        items: [
          {
            accessedWith: [billsAndReloadsRoles.view],
            url: '/bills-reloads/reload-transactions',
            text: 'Reload transactions',
          },
        ],
      },
      {
        text: 'Gateway',
        icon: PortalGatewayIcon,
        type: 'group',
        items: [
          {
            accessedWith: [reconciliationRole.view],
            url: '/gateway/reconciliations',
            text: 'Reconciliations',
          },
          {
            accessedWith: [exceptionsRole.view],
            url: '/gateway/exceptions',
            text: 'Exceptions',
          },
          {
            accessedWith: [pdbRoles.gatewayAccess.admin_gateway_legacy_terminals_view],
            text: 'Terminals',
            url: '/gateway/terminals',
          },
          {
            accessedWith: [terminalSwitchRoles.failed_logs_view],
            text: 'Failed Logs',
            url: '/gateway/failed-logs',
          },
          {
            accessedWith: [terminalSwitchRoles.transaction_view],
            text: 'Switch Transactions',
            url: '/gateway/transactions',
          },
          {
            accessedWith: [terminalSwitchRoles.batch_view],
            text: 'Batch reports',
            url: '/gateway/batches',
          },
          {
            accessedWith: [terminalSwitchRoles.monthly_card_sales_report_view],
            text: 'Monthly card sales report',
            url: '/gateway/monthly-card-sales-report',
          },
          {
            accessedWith: [terminalSwitchRoles.csv_report_view],
            text: 'CSV reports',
            url: '/gateway/csv-reports/hourly-transaction-file',
          },
          {
            accessedWith: [terminalSwitchRoles.force_close_approval_view],
            text: 'Force close approval',
            url: '/gateway/force-close-approval',
          },
          {
            accessedWith: [terminalSwitchRoles.transaction_and_batch_summary_report],
            text: 'Transaction and batch summary report',
            url: '/gateway/transaction-and-batch-summary-report',
          },
        ].filter(Boolean),
      },
      {
        text: 'Terminal',
        icon: PortalTerminalsIcon,
        type: 'group',
        items: [
          environment.showBetaPages
            ? {
                accessedWith: [setelTerminalRoles.devices_view],
                url: '/terminal/devices',
                text: 'Devices',
              }
            : undefined,
          environment.showBetaPages
            ? {
                accessedWith: [setelTerminalRoles.inventory_view],
                url: '/terminal/inventory',
                text: 'Inventory',
              }
            : undefined,
        ].filter(Boolean),
      },
      {
        text: 'Card issuing',
        icon: PortalCardIssuingIcon,
        type: 'group',
        items: [
          {
            text: 'Cards',
            url: '/card-issuing/cards',
            accessedWith: [cardRole.menu],
          },
          {
            text: 'Cardholders',
            url: '/card-issuing/cardholders',
            accessedWith: [cardHolderRole.menu],
          },
          {
            text: 'Card groups',
            url: '/card-issuing/card-groups',
            accessedWith: [cardGroupRole.menu],
          },
          {
            text: 'Card ranges',
            url: '/card-issuing/card-ranges',
            accessedWith: [cardRangeRole.menu],
          },
          {
            text: 'Card transactions',
            url: '/card-issuing/card-transactions',
            accessedWith: [cardTransactionRole.menu],
          },
          {
            text: 'Card expiration date',
            url: '/card-issuing/card-expiry-date',
            accessedWith: [cardExpirationRole.menu],
          },
          {
            text: 'Card PIN mailer',
            url: '/card-issuing/card-pin-mailer',
            accessedWith: [cardPinMailer.view],
          },
          {
            text: 'Reports',
            url: '/card-issuing/reports',
            accessedWith: [pdbRoles.cardReportAccess.menu],
          },
        ],
      },
      {
        text: 'Treasury',
        icon: PortalTreasuryIcon,
        type: 'group',
        items: [
          {
            accessedWith: [prefundingBalanceRole.viewSummary],
            text: 'Wallet prepaid balance',
            url: '/prefunding-balance',
          },
          {
            accessedWith: [ledgerRole.menu],
            url: '/fee-settings',
            text: 'Payment processor fee',
          },
          {
            accessedWith: [ledgerRole.menu],
            url: '/ledger-adjustments',
            text: 'Ledger adjustments',
          },
          {
            accessedWith: [ledgerRole.menu],
            url: '/ledger-transactions',
            text: 'Ledger transactions',
          },
          {
            accessedWith: [ledgerRole.menu],
            url: '/receivables',
            text: 'Receivables',
          },
          {
            accessedWith: [ledgerRole.menu],
            url: '/payouts',
            text: 'Payouts',
          },
          {
            accessedWith: [pdbRoles.generalLedgerPayoutsAccess.read],
            url: '/general-ledger-payouts',
            text: 'Payouts',
          },
          {
            accessedWith: [ledgerRole.menu],
            url: '/treasury/cashflows',
            text: 'Cash flows',
          },
          {
            accessedWith: [pdbRoles.generalLedgerAccess.read],
            url: '/general-ledger',
            text: 'General ledger codes',
          },
          {
            accessedWith: [pdbRoles.generalLedgerAccess.read],
            url: '/general-ledger-rectification',
            text: 'General ledger posting rectification',
          },
          {
            accessedWith: [pdbRoles.sapPostingRole.menu],
            url: '/sap-posting-history',
            text: 'SAP posting history',
          },
          {
            accessedWith: [
              pdbRoles.treasuryReportAccess.read,
              treasuryReportRole.menu,
              ledgerRole.menu,
            ],
            url: '/treasury-reports',
            text: 'Reports',
          },
        ],
      },
      {
        text: 'Compliance controls',
        icon: PortalComplianceIcon,
        type: 'group',
        items: [
          {
            accessedWith: [verificationRoles.view],
            url: '/verifications',
            text: 'Verifications',
          },
          {
            accessedWith: [pdbRoles.approvalRequestRole.view],
            url: '/approvals/approval-requests',
            text: 'Approval requests',
          },
          {
            accessedWith: [pdbRoles.approvalRuleRole.view],
            url: '/approvals/approval-rules',
            text: 'Approval rules',
          },
          {
            accessedWith: [pdbRoles.approverRole.view],
            url: '/approvals/approvers',
            text: 'Approvers',
          },
        ],
      },
      {
        text: 'Risk controls',
        icon: PortalFraudControlsIcon,
        type: 'group',
        items: [
          {
            text: 'Account devices',
            url: '/risk-controls/account-devices',
            accessedWith: [adminAccountRole.adminRead, customerRole.readDevice],
          },
          environment.showBetaPages && {
            text: 'Account devices (Beta)',
            url: '/risk-controls/account-devices/listing',
            accessedWith: [adminAccountRole.adminRead, customerRole.readDevice],
          },
          {
            text: 'Fraud profiles',
            url: '/risk-controls/fraud-profiles',
            accessedWith: [adminRole.userMenu, adminFraudProfile.adminMenu],
          },
          {
            text: 'Risk profiles',
            url: '/risk-controls/risk-profiles/listing',
            accessedWith: [adminRole.userMenu, adminRiskProfile.adminMenu],
          },
          environment.showBetaPages
            ? {
                text: 'Fraud profiles (Beta)',
                url: '/risk-controls/fraud-profiles/listing',
                accessedWith: [adminRole.userMenu, adminFraudProfile.adminMenu],
              }
            : undefined,
        ].filter(Boolean),
      },
      {
        text: 'Subsidy',
        icon: PortalCirclesIcon,
        type: 'group',
        items: [
          {
            accessedWith: [subsidyMaintenanceRole.view],
            url: '/subsidy/subsidy-maintenance',
            text: 'Subsidy maintenance',
          },
          {
            accessedWith: [subsidyRateRole.view],
            url: '/subsidy/subsidy-rates',
            text: 'Subsidy rates',
          },
          {
            accessedWith: [subsidyClaimFilesRole.view],
            url: '/subsidy/subsidy-claim-files',
            text: 'Subsidy claim files',
          },
        ],
      },
      {
        text: 'Buy Now, Pay Later',
        icon: PortalLoyaltyAffiliateIcon,
        type: 'group',
        items: [
          {
            url: '/buy-now-pay-later/plans',
            accessedWith: [adminBnplPlanConfig.adminView],
            text: 'BNPL plans',
          },
          {
            url: '/buy-now-pay-later/accounts',
            accessedWith: [adminBnplAccount.adminView],
            text: 'BNPL accounts',
          },
          // {
          //   url: '/buy-now-pay-later/instructions',
          //   accessedWith: [adminBnplBill.adminView],
          //   text: 'BNPL instructions',
          // },
          // {
          //   url: '/buy-now-pay-later/bills',
          //   accessedWith: [adminBnplInstruction.adminView],
          //   text: 'BNPL bills',
          // },
        ],
      },
    ],
  },

  {
    text: 'ADMINISTRATION',
    items: [
      {
        text: 'Teams',
        icon: PortalTeamsIcon,
        type: 'group',
        items: [
          {
            accessedWith: [adminRole.userRead],
            url: '/admin-users',
            text: 'Users',
          },
          {
            accessedWith: [merchantUserRole.view],
            url: '/merchant-users',
            text: 'Merchant Users',
          },
        ],
      },
      {
        text: 'Maintenance',
        type: 'group',
        icon: PortalMaintenanceIcon,
        items: [
          {
            accessedWith: [maintenanceRole.maintenanceOutageView],
            url: '/outage',
            text: 'Outage handling',
          },
          environment.showBetaPages && {
            accessedWith: [maintenanceRole.maintenanceOutageView],
            url: '/outage/new',
            text: 'Outage handling (Beta)',
          },
          {
            accessedWith: [maintenanceRole.maintenanceVersionView],
            url: '/versions',
            text: 'App versions',
          },
          {
            accessedWith: [calendarAdminRole.access],
            url: '/calendars',
            text: 'Calendars',
          },
        ].filter(Boolean),
      },
      {
        text: 'Enterprise specification',
        icon: PortalMiniAppIcon,
        type: 'group',
        items: [
          {
            accessedWith: [merchantRole.view],
            url: '/merchant-types',
            text: 'Merchant types',
          },
          {
            accessedWith: [merchantRole.view],
            url: '/merchant-links',
            text: 'Merchant links',
          },
        ],
      },
      {
        text: 'Custom field',
        icon: PortalWebhooksIcon,
        type: 'group',
        items: [
          {
            accessedWith: [customFieldRuleRole.view],
            url: '/custom-field-rules',
            text: 'Custom field rule',
          },
        ],
      },
      {
        text: 'Reports',
        icon: PortalReportsIcon,
        type: 'group',
        items: [
          {
            accessedWith: [
              pdbRoles.onDemandReportConfigAccess.read,
              onDemandReportConfigAccess.admin_on_demand_report_config_view,
            ],
            url: '/on-demand-reports',
            text: 'On demand reports',
          },
          CURRENT_ENTERPRISE.name === 'pdb' && {
            accessedWith: [pdbRoles.snapshotReportConfigAccess.read],
            url: '/snapshot-reports',
            text: 'Snapshot reports',
          },
        ].filter(Boolean),
      },
    ],
  },
];

const SIDEBAR_MENU_IS_OPEN_STORAGE_KEY = 'SIDEBAR_MENU_IS_OPEN_STORAGE_KEY';

const storedSidebarIsOpen = localStorage.getItem(SIDEBAR_MENU_IS_OPEN_STORAGE_KEY);

@Component({
  moduleId: module.id,
  selector: 'app-core',
  templateUrl: 'core.html',
  styleUrls: ['core.scss'],
})
export class CoreComponent implements OnInit, OnDestroy {
  @ViewChild('profileMenu', {static: false})
  profileMenuEl: ElementRef;

  menus: IMenuGroup[] = [];
  selectedMenu: IMenuGroup;

  isOpenMenu = storedSidebarIsOpen === null ? true : storedSidebarIsOpen === 'Y';
  isOpenProfile = false;

  session: ISessionData;
  username = '';

  get menuIcon(): string {
    return this.isOpenMenu ? 'assets/images/icons/menu_a.svg' : 'assets/images/icons/menu.svg';
  }

  get navIcon(): string {
    const {icon} = CURRENT_ENTERPRISE;
    return icon;
  }

  allSub: Subject<any> = new Subject<any>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly merchantService: ApiMerchantsService,
  ) {}

  async ngOnInit() {
    this.initSession();
    await this.initMenu();
    this.initOpenState();
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  closeMenu(ev) {
    if (this.profileMenuEl.nativeElement.contains(ev.target)) {
      return;
    }
    this.isOpenProfile = false;
  }

  private initOpenState() {
    fromEvent(window, 'storage')
      .pipe(
        tap(() => {
          const latestIsOpenMenu = localStorage.getItem(SIDEBAR_MENU_IS_OPEN_STORAGE_KEY) !== 'N';
          if (latestIsOpenMenu !== this.isOpenMenu) {
            this.isOpenMenu = latestIsOpenMenu;
          }

          const merchantTypesUpdated =
            localStorage.getItem(MERCHANT_TYPES_UPDATED_STORAGE_KEY) !== 'N';
          if (merchantTypesUpdated) {
            this.initMenu();
            localStorage.setItem(MERCHANT_TYPES_UPDATED_STORAGE_KEY, 'N');
          }
        }),
        takeUntil(this.allSub),
      )
      .subscribe();
  }

  toggleMenu() {
    const nextIsOpen = !this.isOpenMenu;
    this.isOpenMenu = nextIsOpen;
    localStorage.setItem(SIDEBAR_MENU_IS_OPEN_STORAGE_KEY, nextIsOpen ? 'Y' : 'N');
  }

  async initMenu() {
    const {url} = this.router;
    this.menus = (await this.getMenus()) || [];
    const menu = this.findMenuDefault(url);
    this.selectedMenu = menu.menuGroup;
    if (url === '/') {
      if (this.selectedMenu) {
        const redirectTo = menu.menuItem.url;
        this.router.navigate([redirectTo]);
      } else {
        AppEmitter.get(AppEmitter.PermissionDenied).emit();
      }
    }
  }

  findMenuDefault(url: string) {
    let menuGroup: IMenuGroup;
    let menuItemGroup: IMenuItemGroup;
    let menuItem: IMenuItem;

    for (const group of this.menus) {
      for (const itemGroup of group.items) {
        if ('items' in itemGroup) {
          for (const item of itemGroup.items) {
            if (url.indexOf(item.url) !== -1) {
              menuItem = item;
              menuItemGroup = itemGroup as IMenuItemGroup;
              menuGroup = group;
              return {menuGroup, menuItemGroup, menuItem};
            }
          }
        } else {
          const item = itemGroup as IMenuItem;
          if (url.indexOf(item.url) !== -1) {
            menuItem = item;
            menuGroup = group;
            return {menuGroup, menuItemGroup, menuItem};
          }
        }
      }
    }
    return this.findDefaultMenu();
  }

  findDefaultMenu() {
    let menuItemGroup: IMenuItemGroup;
    let menuItem: IMenuItem;
    const menuGroup = this.menus[0];
    if (menuGroup.items[0] && 'items' in menuGroup.items[0]) {
      menuItemGroup = menuGroup.items[0] as IMenuItemGroup;
      menuItem = menuItemGroup.items[0];
    } else {
      menuItem = menuGroup.items[0] as IMenuItem;
    }
    return {menuGroup, menuItemGroup, menuItem};
  }

  initSession() {
    this.session = this.authService.getSessionData();
    this.authService.setAdminUsername();
    const storedSession = this.authService.getSession();
    if (storedSession && storedSession.username) {
      this.username = getShortName(storedSession.username);
    }
  }

  async getMenus(): Promise<IMenuGroup[]> {
    const session = this.session;

    if (!session) {
      return [];
    }

    const userRoles = this.authService.getRoles();
    const enterprises = await this.merchantService.indexEnterpriseProducts().toPromise();
    const currentEnterprise = enterprises[CURRENT_ENTERPRISE.name];
    const merchantTypes = await getMerchantTypesUsed()
      .then((res) => res)
      .catch(() => [] as IMerchantTypeUsed[]);
    localStorage.setItem(MERCHANT_TYPES_USED_STORAGE_KEY, JSON.stringify(merchantTypes));
    const merchantTypesMenus: any[] = merchantTypes.map((types) => {
      return {
        accessedWith: [merchantRole.view],
        url: `/merchants/types/${types.code}`,
        text: types.name,
      };
    });

    function buildMenu(config: Array<IMenuItemGroup | IMenuGroup | IMenuItem>) {
      return config.reduce((acc, menuItem) => {
        /*
          NOTE: Need to check productKey for each menuItem as we dont have productKey defined for all menuItems now.
          Eventually it will be added to each menuItem as part of Admin dashboard navigation steamlining
          https://setelnow.atlassian.net/wiki/spaces/PO/pages/1107918873/Admin+portal+dashboard+portal+navigation+streamlining


          Following expression should be replaced with:
          const isEnterpriseProduct = !!currentEnterprise.products[menuItem.productKey];
        */

        const isEnterpriseProduct = menuItem.productKey
          ? !!currentEnterprise.products[menuItem.productKey]
          : true;

        if (!isEnterpriseProduct) {
          return acc;
        }

        if ('items' in menuItem) {
          const items = buildMenu(menuItem.items);
          if (items.length > 0) {
            acc.push({
              ...menuItem,
              items: buildMenu(menuItem.items),
            });
          }
        } else {
          const isAllowed =
            !menuItem.accessedWith ||
            menuItem.accessedWith.some((role) => userRoles.includes(role));
          if (isAllowed) {
            acc.push(menuItem);
          }
        }

        return acc;
      }, []);
    }

    const businessesMenus = MENU_CONFIG.find((menu) => menu.text === 'Businesses');
    const businessesMenusIndex = MENU_CONFIG.findIndex((menu) => menu.text === 'Businesses');
    const merchantMenus: any = businessesMenus.items.find((menu) => menu.text === 'Merchants');
    const merchantMenusIndex = businessesMenus.items.findIndex((menu) => menu.text === 'Merchants');
    if (merchantMenus.hasOwnProperty('items')) {
      merchantMenus.items = [merchantMenus.items[0], ...merchantTypesMenus];
    }
    businessesMenus.items[merchantMenusIndex] = merchantMenus;
    MENU_CONFIG[businessesMenusIndex] = businessesMenus;
    return buildMenu(MENU_CONFIG);
  }

  logOut() {
    this.authService
      .logout()
      .pipe(takeUntil(this.allSub))
      .subscribe(() => this.router.navigate(['/login']));
  }
  goToProfilePage() {
    this.router.navigate(['/user/profile']);
  }
  expandMenuIcon(active: boolean): string {
    return active ? 'assets/images/icons/minus.svg' : 'assets/images/icons/plus.svg';
  }

  closeNavMenu(selected: IMenuGroup) {
    this.selectedMenu = selected;
    this.isOpenMenu = false;
    this.menus.forEach((menu) => {
      menu.active = false;
    });
  }
}

const getShortName = (name: string) => {
  const shortname =
    name &&
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join('');

  if (shortname && shortname.length > 2) {
    return shortname.charAt(0) + shortname.charAt(shortname.length - 1);
  }

  return shortname;
};
