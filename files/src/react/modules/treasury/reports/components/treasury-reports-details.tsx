import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {OnDemandReportCategory} from 'src/react/services/api-reports.enum';
import {AuthContext} from '../../../auth';
import {OnDemandReportDataViewer} from '../../../on-demand-reports/components/on-demand-report-data-viewer';
import {useTreasuryReportsDetails} from '../treasury-reports.queries';

type TreasuryReportsDetailsProps = {
  url: string;
};

export const TreasuryReportsDetails = (props: TreasuryReportsDetailsProps) => {
  const authRoles = React.useContext(AuthContext);
  const router = useRouter();
  const {data} = useTreasuryReportsDetails(OnDemandReportCategory.TREASURY, props.url);

  const [isAllowed, setIsAllowed] = React.useState(true);

  React.useEffect(() => {
    if (data) {
      const userHasRole = authRoles.permissions.some((role) => data.permissions.includes(role));

      if (!userHasRole) {
        setIsAllowed(false);
      }
    }
  }, [data]);

  if (isAllowed) {
    return (
      <OnDemandReportDataViewer
        category={OnDemandReportCategory.TREASURY}
        url={props.url}
        reportName={data?.reportName}
      />
    );
  }

  router.navigateByUrl('/treasury-reports');
  return null;
};
