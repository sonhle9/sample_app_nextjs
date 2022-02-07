import {
  Badge,
  Button,
  DownloadIcon,
  Filter,
  FilterControls,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  titleCase,
  Alert,
  PaginationNavigation,
  formatMoney,
  formatDate,
  DataTableCaption,
} from '@setel/portal-ui';
import React from 'react';
import {ReceivableTypes} from 'src/app/ledger/ledger-receivables.enum';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {indexReceivables, indexReceivablesCSV} from 'src/react/services/api-ledger.service';
import {TransactionPGVendors} from '../../ledger-transactions/ledger-transactions.enums';
import {ReceivablesStatuses} from '../receivables.enum';

export const ReceivablesListing = () => {
  const {
    query: {data, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      status: STATUS_OPTIONS[0].value,
      processorName: PROCESSOR_NAME_OPTIONS[0].value,
      receivableType: RECEIVABLE_TYPES_OPTIONS[0].value,
      range: ['', ''] as [string, string],
    },
    queryKey: 'receivables-filter',
    queryFn: (currentValues) => {
      const {
        range: [from, to],
        ...currentFilter
      } = currentValues;
      return indexReceivables({...currentFilter, from, to});
    },
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          options: STATUS_OPTIONS,
          label: 'Status',
          'data-testid': 'status-filter',
        },
      },
      {
        key: 'processorName',
        type: 'select',
        props: {
          options: PROCESSOR_NAME_OPTIONS,
          label: 'Processor name',
          'data-testid': 'processor-name-filter',
        },
      },
      {
        key: 'receivableType',
        type: 'select',
        props: {
          options: RECEIVABLE_TYPES_OPTIONS,
          label: 'Type',
          'data-testid': 'receivable-type-filter',
        },
      },
      {
        key: 'range',
        type: 'daterange',
        props: {
          customRangeFormatType: 'dateAndTime',
          label: 'Created on',
        },
      },
    ],
  });

  const [{values, applied}, {reset}] = filter;

  return (
    <PageContainer
      className="pt-7"
      heading="Receivables"
      action={
        <Button
          variant="outline"
          leftIcon={<DownloadIcon />}
          onClick={async () => {
            const [from, to] = values.range;
            const csvData = await indexReceivablesCSV({to, from, ...values});
            downloadFile(
              csvData,
              `receivables-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
            );
          }}>
          DOWNLOAD CSV
        </Button>
      }>
      <div className="mb-8 -mt-2">
        <FilterControls filter={filter} className="mb-8" />
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
            <PaginationNavigation
              total={data?.total}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Transaction date</Td>
              <Td>Processor name</Td>
              <Td>Type</Td>
              <Td>Exceptions</Td>
              <Td>Transactions</Td>
              <Td>Reconciled</Td>
              <Td>Status</Td>
              <Td className="text-right">Amount (RM)</Td>
              <Td className="text-right">Reconciled (RM)</Td>
              <Td className="text-right">Fee (RM)</Td>
              <Td className="text-right">Variance (RM)</Td>
            </Tr>
          </DataTableRowGroup>
          {data && !data.isEmpty ? (
            <DataTableRowGroup>
              {data.items.map((receivable) => (
                <Tr
                  key={receivable.id}
                  render={(props) => (
                    <Link
                      to={`/receivables/${receivable.id}`}
                      data-testid="receivable-record"
                      {...props}
                    />
                  )}>
                  <Td>{formatDate(receivable.transactionDate, {formatType: 'dateAndTime'})}</Td>
                  <Td>{titleCase(receivable.processorName, {hasUnderscore: true})}</Td>
                  <Td>{titleCase(receivable.receivableType, {hasUnderscore: true})}</Td>
                  <Td>{receivable.exceptions.length}</Td>
                  <Td>{receivable.numberOfTransactions}</Td>
                  <Td>{receivable.processedTransactions}</Td>
                  <Td>
                    <Badge color={BADGE_COLOR[ReceivablesStatuses[receivable.status]]}>
                      {ReceivablesStatuses[receivable.status].toUpperCase()}
                    </Badge>
                  </Td>
                  <Td className="text-right">{formatMoney(receivable.recordedAmount)}</Td>
                  <Td className="text-right">{formatMoney(receivable.processedAmount)}</Td>
                  <Td className="text-right">{formatMoney(receivable.feeAmount)}</Td>
                  <Td className="text-right">{formatMoney(receivable.variance)}</Td>
                </Tr>
              ))}
            </DataTableRowGroup>
          ) : (
            <DataTableCaption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available.</p>
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      )}
    </PageContainer>
  );
};

const BADGE_COLOR: {
  [key: string]:
    | 'turquoise'
    | 'grey'
    | 'purple'
    | 'lemon'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'blue'
    | 'offwhite';
} = {
  [ReceivablesStatuses.PENDING]: 'lemon',
  [ReceivablesStatuses.PROCESSED]: 'blue',
  [ReceivablesStatuses.RECONCILED]: 'success',
  [ReceivablesStatuses.ERRORED]: 'error',
  [ReceivablesStatuses.ADJUSTED]: 'blue',
};

const STATUS_OPTIONS = [
  {
    value: '',
    label: 'All statuses',
  },
].concat(
  Object.keys(ReceivablesStatuses).map((key) => ({
    value: key,
    label: titleCase(ReceivablesStatuses[key], {hasUnderscore: true}),
  })),
);

const PROCESSOR_NAME_OPTIONS = [
  {
    value: '',
    label: 'All processor names',
  },
].concat(
  Object.keys(TransactionPGVendors).map((key) => ({
    value: key,
    label: titleCase(TransactionPGVendors[key], {hasUnderscore: true}),
  })),
);

const RECEIVABLE_TYPES_OPTIONS = [
  {
    value: '',
    label: 'All types',
  },
].concat(
  Object.keys(ReceivableTypes).map((key) => ({
    value: key,
    label: titleCase(ReceivableTypes[key], {hasUnderscore: true}),
  })),
);
