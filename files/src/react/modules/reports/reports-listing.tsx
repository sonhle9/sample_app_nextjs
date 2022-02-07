import * as React from 'react';
import {Card} from '@setel/portal-ui';
import {Link} from '../../routing/link';
import {PageContainer} from '../../components/page-container';

export interface IReportItemProps {
  label: string;
  to: string;
  icon?: JSX.Element;
  description?: string;
  className?: string;
  hidden?: boolean;
}

const ReportItem = ({label, to, icon, description, className, hidden}: IReportItemProps) => (
  <Link to={to} className={hidden ? 'hidden' : className}>
    <Card className="h-full px-4 py-5 sm:px-7">
      {!icon ? (
        <p>{label}</p>
      ) : (
        <>
          <div className="text-center">
            {icon}
            <p className="font-medium pt-3">{label}</p>
            <p className="text-xs text-lightgrey pt-1 w-4/5 text-center mx-auto">{description}</p>
          </div>
        </>
      )}
    </Card>
  </Link>
);

interface IReportListingProps {
  items?: IReportItemProps[];
  className?: string;
}

export const ReportsListing = ({items, className}: IReportListingProps) => {
  return (
    <PageContainer heading="Reports" className={'space-y-4'}>
      <div className={className}>
        {items?.map((reportItem) => (
          <ReportItem key={reportItem.label} {...reportItem} />
        ))}
      </div>
    </PageContainer>
  );
};
