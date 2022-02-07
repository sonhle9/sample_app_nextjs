import * as React from 'react';
import {Card, CardContent, DocumentIcon} from '@setel/portal-ui';
import cn from 'classnames';

export type LoyaltyReportCardProps = {
  title?: string;
  description?: string;
  iconClassName?: string;
  disabled?: boolean;
  link: string;
};

export const LoyaltyReportCard: React.VFC<LoyaltyReportCardProps> = ({
  title,
  description,
  iconClassName,
  disabled,
  link,
}) => {
  if (!title || disabled) {
    return null;
  }

  return (
    <Card
      render={(props) => (
        <a href={`loyalty/reports/${link}`} {...props} data-testid="report-card" />
      )}
      className="hover:bg-gray-100 cursor-pointer focus-visible:shadow-outline-gray">
      <CardContent className="p-5 flex-col text-center space-y-2">
        <div className="flex justify-center pb-2">
          <div className={cn('p-5 rounded-full', iconClassName)}>
            <DocumentIcon className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="text-darkgrey font-bold">{title}</div>
        <div className="text-lightgrey text-sm">{description}</div>
      </CardContent>
    </Card>
  );
};
