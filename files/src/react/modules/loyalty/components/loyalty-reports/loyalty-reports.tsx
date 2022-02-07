import * as React from 'react';
import {TextEllipsis} from '@setel/portal-ui';
import {LoyaltyReportCard} from './loyalty-report-card';
import {loyaltyReports} from '../../reports.config';

export const LoyaltyReports = () => {
  return (
    <div className="mb-10 mx-auto px-16 pt-8">
      <TextEllipsis className="flex-grow text-2xl pb-4" text="Reports" widthClass="w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-4 row-gap-5">
        {Object.entries(loyaltyReports).map(([key, value]) => (
          <LoyaltyReportCard {...value} link={key} key={key} />
        ))}
      </div>
    </div>
  );
};
