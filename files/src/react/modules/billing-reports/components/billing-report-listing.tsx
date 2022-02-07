import {Card, CardContent, Text} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {AuthContext} from '../../auth';
import {BILLING_REPORTS} from '../billing-reports.constants';

export const BillingReportListing = () => {
  const auth = React.useContext(AuthContext);

  const displayedReports = React.useMemo(
    () =>
      BILLING_REPORTS.filter((report) =>
        auth.permissions.some((role) => report.permissions.includes(role)),
      ),
    [auth.permissions],
  );

  return (
    <PageContainer heading="Reports">
      <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-6">
        {displayedReports.map((report, index) => (
          <Card
            key={index}
            render={(renderProps) => <Link to={report.url} {...renderProps} />}
            className="p-2 flex flex-col hover:bg-gray-100 focus-visible:shadow-outline-gray">
            <CardContent className="flex flex-col justify-center items-center">
              {report.icon}
              <Text className="font-medium text-darkgrey text-lg text-center mb-2">
                {report.reportName}
              </Text>
              <Text className="text-sm text-gray-500 text-center">{report.reportDescription}</Text>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};
