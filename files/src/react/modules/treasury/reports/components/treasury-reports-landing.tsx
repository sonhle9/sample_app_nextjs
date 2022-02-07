import {Alert, Card, CardContent, Skeleton, Text} from '@setel/portal-ui';
import * as React from 'react';
import {MembershipIcon, RewardsIcon, VehicleIcon} from 'src/react/components/icons';
import {PageContainer} from 'src/react/components/page-container';
import {
  ReportIcons,
  ReportMappingType,
} from 'src/react/modules/on-demand-reports/on-demand-reports.enums';
import {Link} from 'src/react/routing/link';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {AuthContext} from '../../../auth';
import {TREASURY_REPORTS} from '../treasury-reports.const';
import {useTreasuryReportsListing} from '../treasury-reports.queries';

export const TreasuryReportsLanding = () => {
  const auth = React.useContext(AuthContext);

  return (
    <PageContainer heading="Reports">
      {CURRENT_ENTERPRISE.name === 'pdb' && <PdbTreasuryLanding permissions={auth.permissions} />}
      {CURRENT_ENTERPRISE.name === 'setel' && (
        <SetelTreasuryLanding permissions={auth.permissions} />
      )}
    </PageContainer>
  );
};

const SetelTreasuryLanding = (props: {permissions: string[]}) => {
  const displayedReports = React.useMemo(
    () =>
      TREASURY_REPORTS.filter((report) =>
        props.permissions.some((role) => report.permissions.includes(role)),
      ),
    [props.permissions],
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayedReports.map((report, index) => (
        <Card
          render={(renderProps) => <Link to={report.url} {...renderProps} />}
          className="hover:bg-gray-100 focus-visible:shadow-outline-gray"
          key={index}>
          <CardContent className="flex flex-col justify-center items-center">
            {report.icon}
            <Text className="text-lg text-center my-4">{report.reportName}</Text>
            <Text className="text-lightgrey text-center text-sm">{report.reportDescription}</Text>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const PdbTreasuryLanding = (props: {permissions: string[]}) => {
  const {data, isLoading} = useTreasuryReportsListing();
  const displayedReports = React.useMemo(
    () =>
      data &&
      data.filter((report) => props.permissions.some((role) => report.permissions.includes(role))),
    [data, props.permissions],
  );

  return (
    <>
      {displayedReports && displayedReports.length === 0 && (
        <Alert
          variant="info"
          description="No reports found. Please check with your administrator if this is unexpected."
        />
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <>
            <Placeholder />
            <Placeholder />
            <Placeholder />
            <Placeholder />
          </>
        )}
        {displayedReports &&
          displayedReports.map((report) => {
            let reportIcon;
            let bgIcon;
            switch (report.icon) {
              case ReportIcons.membership.value:
                reportIcon = <MembershipIcon />;
                bgIcon =
                  report.reportMappings.length &&
                  report.reportMappings[0].mappingType === ReportMappingType.summary
                    ? ReportIcons.membership.bgLight
                    : ReportIcons.membership.bgDark;
                break;
              case ReportIcons.vehicle.value:
                reportIcon = <VehicleIcon />;
                bgIcon =
                  report.reportMappings.length &&
                  report.reportMappings[0].mappingType === ReportMappingType.summary
                    ? ReportIcons.vehicle.bgLight
                    : ReportIcons.vehicle.bgDark;
                break;
              default:
                reportIcon = <RewardsIcon />;
                bgIcon =
                  report.reportMappings.length &&
                  report.reportMappings[0].mappingType === ReportMappingType.summary
                    ? ReportIcons.reward.bgLight
                    : ReportIcons.reward.bgDark;
                break;
            }
            return (
              <Card
                render={(renderProps) => (
                  <Link to={`/treasury-reports/${report.url}`} {...renderProps} />
                )}
                className="hover:bg-gray-100 focus-visible:shadow-outline-gray"
                key={report.id}>
                <CardContent className="flex flex-col justify-center items-center">
                  <div className={`${bgIcon} p-5 rounded-full`}>{reportIcon}</div>
                  <Text className="text-lg my-4">{report.reportName}</Text>
                  <Text className="text-lightgrey text-center text-sm">
                    {report.reportDescription}
                  </Text>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </>
  );
};

const Placeholder = () => (
  <Card isLoading>
    <CardContent className="flex flex-col justify-center items-center">
      <div className="bg-gray-200 w-20 h-20 rounded-full" />
      <Skeleton className="my-4" height="medium" width="medium" />
      <div className="text-center">
        <Skeleton />
      </div>
    </CardContent>
  </Card>
);
