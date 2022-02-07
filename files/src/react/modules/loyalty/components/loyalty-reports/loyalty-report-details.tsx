import * as React from 'react';
import {
  TextEllipsis,
  Card,
  CardContent,
  FieldContainer,
  DateRangeDropdown,
  DropdownSelect,
  DATES,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableCaption,
  Button,
  formatDate,
} from '@setel/portal-ui';
import {formatISO} from 'date-fns';
import {useGetSnapshotReports} from '../../loyalty-reports.queries';
import {loyaltyReports} from '../../reports.config';

const options = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Yesterday',
    value: formatISO(DATES.yesterday) as string,
  },
  {
    label: 'Last 7 days',
    value: formatISO(DATES.sevenDaysAgo) as string,
  },
  {
    label: 'Last 30 days',
    value: formatISO(DATES.thirtyDaysAgo) as string,
  },
];

export type LoyaltyReportDetailsProps = {
  report?: string;
};

export const LoyaltyReportDetails: React.VFC<LoyaltyReportDetailsProps> = ({report}) => {
  const [reportSelected, setReport] = React.useState<string>('');
  const [date, setDate] = React.useState<[string, string]>(['', '']);

  const {data, isError, isSuccess, isLoading} = useGetSnapshotReports(reportSelected, {
    from: date[0],
    to: date[1],
  });

  return (
    <div className="mb-10 mx-auto px-16 pt-8">
      <TextEllipsis
        className="flex-grow text-2xl pb-4"
        text={loyaltyReports[report].title}
        widthClass="w-full"
      />
      <Card className="mb-8">
        <CardContent className="grid grid-cols-4 gap-4">
          <FieldContainer label="Reports" className="col-span-2">
            <DropdownSelect<string>
              value={reportSelected}
              data-testid="report-type"
              onChangeValue={setReport}
              options={loyaltyReports[report].reports}
            />
          </FieldContainer>
          <div className="col-span-2 lg:col-span-1">
            <DateRangeDropdown
              label="Created on"
              value={date}
              onChangeValue={setDate}
              options={options}
              dayOnly
              disableFuture
            />
          </div>
        </CardContent>
      </Card>
      <DataTable isLoading={isLoading} skeletonRowNum={3} striped>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>Report name</Td>
            <Td>Created on</Td>
            <Td className="text-right">Actions</Td>
          </Tr>
        </DataTableRowGroup>
        {isError || !reportSelected || !data?.length ? (
          <DataTableCaption
            className="text-center py-12 text-mediumgrey text-md"
            data-testid="no-reports">
            {!reportSelected ? (
              <p>Please select report</p>
            ) : (
              <>
                <p>No reports found</p>
                <p>Try again with a different information type</p>
              </>
            )}
          </DataTableCaption>
        ) : (
          <DataTableRowGroup>
            {isSuccess &&
              data?.length > 0 &&
              data.map((reportData) => (
                <Tr key={reportData.id}>
                  <Td>{reportData.fileName || ''}</Td>
                  <Td>{reportData.createdAt ? formatDate(reportData.createdAt) : '-'}</Td>
                  <Td className="text-right">
                    {reportData.downloadUrl && (
                      <Button
                        variant="outline"
                        className="border-none shadow-none p-0"
                        render={(props) => (
                          <a
                            href={reportData.downloadUrl}
                            {...props}
                            download
                            data-testid="download-report"
                          />
                        )}>
                        DOWNLOAD
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </div>
  );
};
