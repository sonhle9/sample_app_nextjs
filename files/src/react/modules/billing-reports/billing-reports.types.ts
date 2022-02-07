export interface IBillingReportConfig {
  reportName: React.ReactNode;
  reportDescription: React.ReactNode;
  permissions: string[];
  url: string;
  icon: React.ReactNode;
}

export enum DEMAND_REPORT_BILLING_URLS {
  BILLING_TRANSACTIONS_BY_PRODUCT_CATEGORY = 'billing-transactions-by-product-category',
}
