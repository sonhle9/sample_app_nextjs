import {
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DownloadIcon,
  IconButton,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {
  useSnapshotReport,
  useSnapshotReportConfigByFolderName,
} from '../../snapshot-reports.queries';

const folderName = 'gift_card_aging';

export const SnapshotReportExample = () => {
  const {data, isLoading} = useSnapshotReport(folderName);
  const {data: config, isLoading: isLoadingConfig} =
    useSnapshotReportConfigByFolderName(folderName);

  return (
    <PageContainer heading={config && config.reportName}>
      <DataTable isLoading={isLoading || isLoadingConfig}>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>Report name</Td>
            <Td className="w-8"></Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup>
          {data &&
            data.map((dat, i) => (
              <Tr key={i}>
                <Td>{dat.fileName}</Td>
                <Td>
                  <DownloadBtn downloadUrl={dat.downloadUrl} />
                </Td>
              </Tr>
            ))}
        </DataTableRowGroup>
      </DataTable>
    </PageContainer>
  );
};

const DownloadBtn = (props: {downloadUrl: string}) => (
  <IconButton
    render={(btnProps) => (
      <a {...btnProps} href={props.downloadUrl} download title="Download Report" />
    )}>
    <span className="sr-only">Download</span>
    <DownloadIcon className="text-lightgrey" />
  </IconButton>
);
