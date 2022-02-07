import {
  Alert,
  Badge,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  PaginationNavigation,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {PayoutBatchStatus} from 'src/react/services/api-processor.enum';
import {getPayoutsBatch, getPayoutsCSV} from 'src/react/services/api-processor.service';

export const PayoutsListing = () => {
  const {
    query: {data: resolvedData, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      status: STATUS_OPTIONS[0].value as PayoutBatchStatus,
      range: ['', ''] as [string, string],
    },
    queryKey: 'payouts',
    queryFn: (currentValues) => {
      const {
        range: [from, to],
        ...currentFilter
      } = currentValues;
      return getPayoutsBatch({...currentFilter, from, to});
    },
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          options: STATUS_OPTIONS,
          label: 'Status',
        },
      },
      {
        key: 'range',
        type: 'daterange',
        props: {
          label: 'Date',
          customRangeFormatType: 'dateAndTime',
        },
      },
    ],
  });

  const [{values, applied}, {reset}] = filter;

  const downloadCsv = async () => {
    const csvData = await getPayoutsCSV(values.status, values.range);
    downloadFile(csvData, `payouts-list-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`);
  };

  const noRecord = !resolvedData || resolvedData.isEmpty;

  return (
    <PageContainer
      heading="Payouts"
      action={
        <Button disabled={noRecord} onClick={downloadCsv} variant="outline">
          DOWNLOAD CSV
        </Button>
      }>
      <div className="mb-8 space-y-8">
        <FilterControls filter={filter} />
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
              <Td>Transaction Date</Td>
              <Td>Status</Td>
              <Td>Processor Name</Td>
              <Td className="text-right">Transactions</Td>
              <Td className="text-right">Amount (RM)</Td>
              <Td className="text-right">Exceptions</Td>
              <Td className="text-right">Pending</Td>
              <Td className="text-right">Processed</Td>
              <Td className="text-right">Processed Amount (RM)</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((parameter) => (
                <Tr
                  key={parameter.id}
                  render={(props) => (
                    <Link to={`/payouts/${parameter.id}`} data-testid="gl-code-record" {...props} />
                  )}>
                  <Td>{formatDate(parameter.transactionDate, {format: 'dd MMM yyyy'})}</Td>
                  <Td>
                    <Badge
                      rounded="rounded"
                      color={
                        parameter.rejectedCount > 0
                          ? 'error'
                          : payoutBatchStatusColorMap[parameter.status]
                      }>
                      {displayStatus[parameter.status]}
                    </Badge>
                  </Td>
                  <Td>{titleCase(parameter.processorName.toLowerCase())}</Td>
                  <Td className="text-right">{parameter.totalCount}</Td>
                  <Td className="text-right">{formatMoney(parameter.totalAmount)}</Td>
                  <Td className="text-right">{parameter.rejectedCount}</Td>
                  <Td className="text-right">{parameter.pendingCount}</Td>
                  <Td className="text-right">{parameter.processedCount}</Td>
                  <Td className="text-right">{formatMoney(parameter.processedAmount)}</Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const payoutBatchStatusColorMap = {
  [PayoutBatchStatus.PARTIAL_COMPLETED]: 'lemon',
  [PayoutBatchStatus.PAYMENT_FILE_SUBMITTED]: 'lemon',
  [PayoutBatchStatus.ACK_SUCCEEDED]: 'lemon',
  [PayoutBatchStatus.COMPLETED]: 'success',
  [PayoutBatchStatus.ACK_REJECTED]: 'error',
  [PayoutBatchStatus.ACK_INVALID]: 'error',
  [PayoutBatchStatus.ACK_PARTIAL_REJECTED]: 'error',
  [PayoutBatchStatus.PAYMENT_FILE_PROCESSING]: 'lemon',
} as const;

const displayStatus = {
  [PayoutBatchStatus.PARTIAL_COMPLETED]: 'PARTIAL COMPLETED',
  [PayoutBatchStatus.PAYMENT_FILE_SUBMITTED]: 'SUBMITTED',
  [PayoutBatchStatus.ACK_SUCCEEDED]: 'ACK SUCCEEDED',
  [PayoutBatchStatus.COMPLETED]: 'COMPLETED',
  [PayoutBatchStatus.ACK_REJECTED]: 'ACK REJECTED',
  [PayoutBatchStatus.ACK_INVALID]: 'ACK INVALID',
  [PayoutBatchStatus.ACK_PARTIAL_REJECTED]: 'ACK PARTIAL REJECTED',
  [PayoutBatchStatus.PAYMENT_FILE_PROCESSING]: 'PROCESSING',
} as const;

const STATUS_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
].concat(
  Object.keys(PayoutBatchStatus).map((key) => ({
    label: titleCase(PayoutBatchStatus[key], {hasUnderscore: true}),
    value: key,
  })),
);
