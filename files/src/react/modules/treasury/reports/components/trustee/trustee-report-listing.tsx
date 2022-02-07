import {
  Alert,
  Badge,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DateRangeDropdown,
  DownloadIcon,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
  useFilter,
  usePaginationState,
  TextEllipsis,
} from '@setel/portal-ui';
import * as React from 'react';
import {useMutation} from 'react-query';
import {ReportTypes} from 'src/app/ledger/pages/reports/reports.enum';
import {PageContainer} from 'src/react/components/page-container';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {getReportsCSV} from 'src/react/services/api-ledger.service';
import {useReports} from '../../treasury-reports.queries';

export const TrusteeReportListing = () => {
  const [{values, applied}, {setValue, reset}] = useFilter({
    from: '',
    to: '',
  });

  const pagination = usePaginationState();
  const {
    data: resolvedData,
    isLoading,
    isError,
    isFetching,
  } = useReports({
    page: pagination.page,
    perPage: pagination.perPage,
    type: ReportTypes.MBB_TRUSTEE,
    ...values,
  });

  const {mutate: downloadCsv, isLoading: isDownloadingCsv} = useMutation(async () => {
    const csvData = await getReportsCSV(ReportTypes.MBB_TRUSTEE, values.from, values.to);
    downloadFile(
      csvData,
      `trustee-report-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  });

  const noRecord = !resolvedData || resolvedData.isEmpty;

  return (
    <PageContainer
      heading="Maybank trustee report"
      action={
        <Button
          disabled={noRecord}
          onClick={() => downloadCsv()}
          isLoading={isDownloadingCsv}
          leftIcon={<DownloadIcon />}
          variant="outline">
          DOWNLOAD CSV
        </Button>
      }>
      <div className="mb-8 space-y-8">
        <FilterControls>
          <DateRangeDropdown
            customRangeFormatType="dateAndTime"
            label="Date"
            value={[values.from, values.to]}
            onChangeValue={(value) => {
              setValue('from', value[0]);
              setValue('to', value[1]);
            }}
          />
        </FilterControls>
        {applied.length > 0 && (
          <Filter onReset={reset}>
            {applied.map((item) => (
              <Badge onDismiss={item.resetValue} key={item.prop}>
                {item.label}
              </Badge>
            ))}
          </Filter>
        )}
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            resolvedData && (
              <PaginationNavigation
                total={resolvedData.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Report Date</Td>
              <Td>Report Name</Td>
              <Td>Emailed To</Td>
              <Td>Emailed On</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup groupType="tbody">
            {resolvedData &&
              resolvedData.items.map((parameter) => (
                <Tr
                  key={parameter.id}
                  render={(props) => (
                    <Link
                      to={`/treasury-reports/trustee/${parameter.id}`}
                      data-testid="trustee-report"
                      {...props}
                    />
                  )}>
                  <Td className="min-w-40">
                    {formatDate(parameter.reportDate, {format: 'd MMM yyyy'})}
                  </Td>
                  <Td>
                    Setel Ventures Sdn Bhd - Daily Summary Report{' '}
                    {formatDate(parameter.reportDate, {format: 'd MMM yyyy'})}
                  </Td>
                  <Td className="min-w-60">
                    {parameter.emailedTo.map((item, index) => (
                      <>
                        <TextEllipsis
                          key={index}
                          text={item.emails.join(', ')}
                          widthClass="w-60"></TextEllipsis>
                        <br />
                      </>
                    ))}
                  </Td>
                  <Td>
                    {parameter.emailedTo.map((item, index) => (
                      <>
                        <p key={index}>{formatDate(item.date, {formatType: 'dateAndTime'})}</p>
                        <br />
                      </>
                    ))}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};
