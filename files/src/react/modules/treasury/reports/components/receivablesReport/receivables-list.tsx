import {
  Alert,
  Badge,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DateRangeDropdown,
  Filter,
  FilterControls,
  DownloadIcon,
  formatDate,
  PaginationNavigation,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import React from 'react';
import {ReportTypes} from 'src/app/ledger/pages/reports/reports.enum';
import {PageContainer} from 'src/react/components/page-container';
import {getReportsCSV} from 'src/react/services/api-ledger.service';
import {useReports} from '../../treasury-reports.queries';
import {downloadFile} from 'src/react/lib/utils';

export const ReceivablesList = () => {
  const [{values, applied}, {setValue, reset}] = useFilter({
    from: '',
    to: '',
  });

  const pagination = usePaginationState();
  const {
    data: resolvedData,
    isLoading,
    isError,
  } = useReports({
    page: pagination.page,
    perPage: pagination.perPage,
    type: ReportTypes.RECEIVABLES,
    ...values,
  });

  const downloadCsv = async () => {
    const csvData = await getReportsCSV(ReportTypes.RECEIVABLES, values.from, values.to);
    downloadFile(
      csvData,
      `receivables-report-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  };

  const noRecord = !resolvedData || resolvedData.isEmpty;
  return (
    <>
      <PageContainer
        heading="Receivables Report"
        action={
          <Button
            disabled={noRecord}
            onClick={downloadCsv}
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
                <Td>Report ID</Td>
                <Td>Report Date</Td>
                <Td className="text-right">Total Amount (RM)</Td>
                <Td>Transaction Count</Td>
                <Td className="text-right">Created At</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {resolvedData &&
                resolvedData.items.map((parameter) => (
                  <Tr
                    key={parameter.id}
                    render={(props) => (
                      <a
                        href={`/reports/receivables/${parameter.id}`}
                        target="_BLANK"
                        data-testid="receivables-record"
                        {...props}
                      />
                    )}>
                    <Td>{parameter.id}</Td>
                    <Td>
                      {parameter.reportDate &&
                        formatDate(parameter.reportDate, {format: 'dd MMM yyyy'})}
                    </Td>
                    <Td className="text-right">{parameter.totalAmount}</Td>
                    <Td>{parameter.transactionsCount}</Td>
                    <Td className="text-right">
                      {parameter.createdAt &&
                        formatDate(parameter.createdAt, {format: 'dd MMM yyyy'})}
                    </Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
          </DataTable>
        )}
      </PageContainer>
    </>
  );
};
