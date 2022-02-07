import {ListIcon} from '@setel/portal-ui';
import * as React from 'react';
import {ledgerRole} from 'src/shared/helpers/roles.type';

export interface ITreasuryReportConfig {
  reportName: React.ReactNode;
  reportDescription: React.ReactNode;
  permissions: string[];
  url: string;
  icon: React.ReactNode;
}

export const TREASURY_REPORTS: ITreasuryReportConfig[] = [
  {
    reportName: 'Maybank trustee report',
    reportDescription: 'Maybank trustee report',
    url: '/treasury-reports/trustee',
    icon: (
      <div className="bg-red-500 p-5 rounded-full">
        <ListIcon className="w-10 h-10 text-white fill-current" />
      </div>
    ),
    permissions: [ledgerRole.read],
  },
  {
    reportName: 'MT940 for collection account report',
    reportDescription: 'Daily MT940 statement for collection account',
    url: '/treasury-reports/mt940/COLLECTION',
    icon: (
      <div className="bg-info-500 p-5 rounded-full">
        <ListIcon className="w-10 h-10 text-white fill-current" />
      </div>
    ),
    permissions: [ledgerRole.read],
  },
  {
    reportName: 'MT940 for operating account report',
    reportDescription: 'Daily MT940 statement for operating account',
    url: '/treasury-reports/mt940/OPERATING',
    icon: (
      <div className="bg-lemon-500 p-5 rounded-full">
        <ListIcon className="w-10 h-10 text-white fill-current" />
      </div>
    ),
    permissions: [ledgerRole.read],
  },
];
