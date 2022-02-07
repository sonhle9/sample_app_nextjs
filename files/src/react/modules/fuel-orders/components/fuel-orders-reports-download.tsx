import * as React from 'react';
import {OnDemandReportDownload} from '../../on-demand-reports/components/on-demand-report-download';

type FuelOrdersReportsDownloadProps = {
  generationId: string;
};

export const FuelOrdersReportsDownload = (props: FuelOrdersReportsDownloadProps) => {
  return <OnDemandReportDownload generationId={props.generationId} />;
};
