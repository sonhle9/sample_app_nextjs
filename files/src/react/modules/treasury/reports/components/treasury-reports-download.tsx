import * as React from 'react';
import {OnDemandReportDownload} from '../../../on-demand-reports/components/on-demand-report-download';

type TreasuryReportsDownloadProps = {
  generationId: string;
};

export const TreasuryReportsDownload = (props: TreasuryReportsDownloadProps) => {
  return <OnDemandReportDownload generationId={props.generationId} />;
};
