import {setupServer} from 'msw/node';
import {handlers as loyaltyMembersHandlers} from 'src/react/modules/loyalty/mocks/loyalty-members.service.mock';
import {handlers as loyaltyHandlers} from 'src/react/modules/loyalty/mocks/loyalty.service.mock';
import {handlers as pointRulesHandlers} from 'src/react/modules/loyalty/mocks/point-rules.service.mock';
import {handlers as pointsBalanceHandlers} from 'src/react/modules/loyalty/mocks/points-balance.service.mock';
import {handlers as loyaltyPointsHandlers} from 'src/react/modules/loyalty/mocks/points.service.mock';
import {handlers as apiCashflowsHandlers} from 'src/react/modules/treasury/cashflows/mocks/cashflows.service.mock';
import {handlers as apiPrefundingBalance} from 'src/react/modules/treasury/prefunding-balance/mocks/prefunding-balance.service.mock';
import {handlers as apiAccountsHandlers} from './api-accounts.service.mock';
import {handlers as apiAttributesHandlers} from './api-attributes.service.mock';
import {handlers as apiBalanceExpiryHandlers} from './api-balance-expiry.service.mock';
import {handlers as apiBlacklistHandlers} from './api-blacklist.service.mock';
import {handlers as apiBudgetHandlers} from './api-budget.service.mock';
import {handlers as apiCompaniesHandlers} from './api-companies.service.mock';
import {handlers as apiCustomFieldRulesHandlers} from './api-custom-field-rules.service.mock';
import {handlers as apiBadgesHandlers} from './api-customerBadges.service.mock';
import {handlers as apiDealshandlers} from './api-deals.service.mock';
import {handlers as apiExternalOrdersHandlers} from './api-external-orders.service.mock';
import {handlers as apiFuelPricingHandlers} from './api-fuel-pricing.service.mock';
import {handlers as apiIamHandlers} from './api-iam.service.mock';
import {handlers as apiLedgerHandlers} from './api-ledger.service.mock';
import {handlers as apiLegacyTerminalsHandlers} from './api-legacy-terminals.service.mock';
import {handlers as apiMaintenanceHandlers} from './api-maintenance.service.mock';
import {handlers as apiMembershipHandlers} from './api-membership.mock';
import {handlers as apiMerchantsHandlers} from './api-merchants.service.mock';
import {handlers as apiOpsHandlers} from './api-ops.service.mock';
import {handlers as apiOrdersHandlers} from './api-orders.service.mock';
import {handlers as apiPaymentsHandlers} from './api-payments.service.mock';
import {handlers as apiProcessorHandlers} from './api-processor.service.mock';
import {handlers as apiReportsHandlers} from './api-reports.service.mock';
import {handlers as apiRewardsHandlers} from './api-rewards.service.mock';
import {handlers as apiRiskProfileHandlers} from './api-risk-profiles.service.mock';
import {handlers as apiSettlementHandlers} from './api-settlement.service.mock';
import {handlers as apiSmartPayHandlers} from './api-smartpay.service.mock';
import {handlers as apiStationsHandlers} from './api-stations.service.mock';
import {handlers as apiStoreOrdersHandlers} from './api-store-orders.service.mock';
import {handlers as apiStoresHandlers} from './api-stores.service.mock';
import {handlers as apiSwitchHandlers} from './api-switch.service.mock';
import {handlers as apiTerminalSwitchHandles} from './api-terminal-switch.mock';
import {handlers as apiTerminalHandlers} from './api-terminal.service.mock';
import {handlers as apiTopUpHandlers} from './api-top-ups.mock';
import {handlers as apiVariablesHandlers} from './api-variables.service.mock';
import {handlers as apiVerificationsHandlers} from './api-verifications.service.mock';
import {handlers as apiVouchersHandlers} from './api-vouchers.service.mock';
import {handlers as apiWalletsHandlers} from './api-wallets.service.mock';
import {handlers as apiWorkflowsHandlers} from './api-workflows.service.mock';
import {handlers as apiCheckoutTransactionHandlers} from './api-checkout.service.mock';
import {handlers as apiCirclesHandlers} from './api-circles.service.mock';
import {handlers as parkingServiceMocks} from 'src/react/modules/parking/mocks/parking.service.mocks';
import {handlers as apiPartnerSftpHandler} from './api-partner-sftp.service.mock';
import {handlers as apiRebatesHandler} from './api-rebates.service.mock';
import {handlers as apiPaymentAcceptanceHandlers} from './api-payment-acceptance.service.mock';
import {apiCardsHandlers} from './api-cards.service.mock';

export const server = setupServer(
  ...pointRulesHandlers,
  ...loyaltyMembersHandlers,
  ...apiReportsHandlers,
  ...loyaltyHandlers,
  ...loyaltyPointsHandlers,
  ...pointsBalanceHandlers,
  ...apiLedgerHandlers,
  ...apiVerificationsHandlers,
  ...apiStoreOrdersHandlers,
  ...apiOpsHandlers,
  ...apiIamHandlers,
  ...apiProcessorHandlers,
  ...apiVariablesHandlers,
  ...apiAttributesHandlers,
  ...apiStoresHandlers,
  ...apiAccountsHandlers,
  ...apiBalanceExpiryHandlers,
  ...apiBlacklistHandlers,
  ...apiMaintenanceHandlers,
  ...apiMerchantsHandlers,
  ...apiOrdersHandlers,
  ...apiPaymentsHandlers,
  ...apiStationsHandlers,
  ...apiVouchersHandlers,
  ...apiWalletsHandlers,
  ...apiDealshandlers,
  ...apiCompaniesHandlers,
  ...apiSettlementHandlers,
  ...apiSwitchHandlers,
  ...apiCashflowsHandlers,
  ...apiLegacyTerminalsHandlers,
  ...apiPrefundingBalance,
  ...apiCustomFieldRulesHandlers,
  ...apiFuelPricingHandlers,
  ...apiWorkflowsHandlers,
  ...apiSmartPayHandlers,
  ...apiTerminalHandlers,
  ...apiMembershipHandlers,
  ...apiExternalOrdersHandlers,
  ...apiBudgetHandlers,
  ...apiRewardsHandlers,
  ...apiTopUpHandlers,
  ...apiBadgesHandlers,
  ...apiRiskProfileHandlers,
  ...apiTerminalSwitchHandles,
  ...apiCheckoutTransactionHandlers,
  ...apiCirclesHandlers,
  ...parkingServiceMocks,
  ...apiPartnerSftpHandler,
  ...apiRebatesHandler,
  ...apiPaymentAcceptanceHandlers,
  ...apiCardsHandlers,
);
