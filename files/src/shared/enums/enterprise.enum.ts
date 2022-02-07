import {PetronasGreenIcon} from '@setel/portal-ui';
import {environment} from 'src/environments/environment';
import {AppLogo} from 'src/react/components/app-logo';

export enum IamNamespaces {
  PDB_ADMINS = 'pdb-admins',
  SETEL_ADMINS = 'setel-admins',
}

export enum EnterpriseNameEnum {
  SETEL = 'setel',
  PDB = 'pdb',
}

export interface IEnterprise {
  name: EnterpriseNameEnum;
  displayName: string;
  iamNamespace: IamNamespaces;
  shortName: string;
  url: string;
  dashboardUrl: string;
  icon: string;
  smallIcon: string;
  LogoComponent: React.ComponentType<{className?: string}>;
  adminNamespace: string;
}

export const setelEnterprise = {
  name: EnterpriseNameEnum.SETEL,
  displayName: 'Setel',
  iamNamespace: IamNamespaces.SETEL_ADMINS,
  shortName: 'Setel',
  icon: 'assets/images/app-logo.svg',
  smallIcon: 'assets/images/logo-setel-circle-white-no-text.svg',
  url: environment.setelUrl,
  dashboardUrl: environment.setelWebDashboardUrl,
  LogoComponent: AppLogo,
  adminNamespace: 'setel-admins',
};

export const pdbEnterprise = {
  name: EnterpriseNameEnum.PDB,
  displayName: 'PETRONAS Dagangan Berhad',
  iamNamespace: IamNamespaces.PDB_ADMINS,
  icon: 'assets/images/logo-pdb-circle-white.svg',
  smallIcon: 'assets/images/logo-pdb-circle-white.svg',
  shortName: 'PDB',
  url: environment.pdbUrl,
  dashboardUrl: environment.pdbWebDashboardUrl,
  LogoComponent: PetronasGreenIcon,
  adminNamespace: 'pdb-admins',
};

export const KEYED_ENTERPRISES: {[key in EnterpriseNameEnum]: IEnterprise} = {
  setel: setelEnterprise,
  pdb: pdbEnterprise,
};

export const ENTERPRISES: IEnterprise[] = Object.values(KEYED_ENTERPRISES);

export enum EnterpriseProducts {
  ACCOUNTS = 'accounts',
  CUSTOMERS = 'customers',
  MERCHANTS = 'merchants',
  COMPANIES = 'companies',
  HARDWARE = 'hardware',
  RETAIL = 'retail',
  FULFILLMENT = 'fulfillment',
  FUELING = 'fuelling',
  CATALOGUE = 'catalogue',
  POINT_OF_SALE = 'pointOfSale',
  ECOMMERCE = 'eCommerce',
  INVENTORY = 'inventory',
  SHIPPING = 'shipping',
  TIMESHEET = 'timesheet',
  LOYALTY_AFFILIATE = 'loyaltyAffiliate',
  LOYALTY = 'loyalty',
  DEALS = 'deals',
  REWARDS = 'rewards',
  REACH = 'reach',
  GIFTS = 'gifts',
  GAMIFICATION = 'gamification',
  EXPERIENCE = 'experience',
  ATTRIBUTION = 'attribution',
  ADVERTISING = 'advertising',
  CUSTOMER_DATA_PLATFORM = 'customerDataPlatform',
  DATA_PIPELINE = 'dataPipeline',
  VEHICLES = 'vehicles',
  DRIVE = 'drive',
  WALLET = 'wallet',
  PAYMENTS = 'payments',
  BUDGETING = 'budgeting',
  CIRCLES = 'circles',
  HOUSE_ACCOUNT = 'houseAccount',
  BILLING = 'billing',
  BILLS_RELOADS = 'billsReloads',
  VAULT = 'vault',
  GATEWAY = 'gateway',
  CARD_ISSUING = 'cardIssuing',
  TREASURY = 'treasury',
  COMPLIANCE_CONTROLS = 'complianceControls',
  RISK_CONTROLS = 'riskControls',
  SUBSIDY = 'subsidy',
  PRICING = 'pricing',
  PAYMENT_CONTROLLER = 'paymentController',
  FINANCIAL_REBATES = 'financialRebates',
  DEVELOPER = 'developer',
  TEAMS = 'teams',
  MAINTENANCE = 'maintenance',
  SUPPORT = 'support',
}
