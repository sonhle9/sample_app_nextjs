import React from 'react';
import {SettlementsIcon} from '@setel/portal-ui';
import {billingReportsRole} from 'src/shared/helpers/roles.type';
import {IBillingReportConfig} from './billing-reports.types';

export const BILLING_REPORTS: IBillingReportConfig[] = [
  {
    reportName: 'Transactions by product category',
    reportDescription: 'Purchase transactions statistics made by merchant by billing cycle',
    url: '/billing/reports/billing-transactions-by-product-category',
    icon: (
      <div className="w-20 h-20 bg-purple-200 mb-4 rounded-full justify-center items-center flex">
        <SettlementsIcon className="w-10 h-10" color="white" />
      </div>
    ),
    permissions: [billingReportsRole.view],
  },
];

export const optBillingFleetPlanFilter = [
  {
    label: 'Postpaid',
    value: 'postpaid',
  },
  {
    label: 'Prepaid',
    value: 'prepaid',
  },
];

export const optBillingSalesRegionFilter = [];
