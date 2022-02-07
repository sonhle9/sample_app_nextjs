import {
  Alert,
  Badge,
  BadgeProps,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DownloadIcon,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {getAdjustmentsCSV, getLedgerAdjustments} from 'src/react/services/api-ledger.service';
import {LedgerTransactionStatus} from 'src/react/modules/ledger/ledger-transactions/ledger-transactions.enums';
import {camelToSentenceCase} from 'src/shared/helpers/format-text';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';

export const LedgerAdjustmentsList = () => {
  const {
    query: {data: resolvedData, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      range: ['', ''] as [string, string],
      account: '',
    },
    queryKey: 'filter-ledger-adjustments',
    queryFn: (currentValues) => {
      const {
        range: [from, to],
        ...filter
      } = currentValues;
      return getLedgerAdjustments({from, to, ...filter});
    },
    components: () => [
      {
        key: 'account',
        type: 'select',
        props: {
          options: ACCOUNT_OPTIONS,
          label: 'Account',
        },
      },
      {
        key: 'range',
        type: 'daterange',
        props: {
          label: 'Created on',
        },
      },
    ],
  });
  const [{values}] = filter;

  const downloadCsv = async () => {
    const [from, to] = values.range;
    const csvData = await getAdjustmentsCSV(values.account, from, to);
    downloadFile(
      csvData,
      `ledger-adjustments-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  };

  const noRecord = !resolvedData || resolvedData.isEmpty;
  return (
    <PageContainer
      heading="Ledger Adjustments"
      action={
        <Button
          disabled={noRecord || (!values.range[0] && !values.range[1])}
          onClick={downloadCsv}
          leftIcon={<DownloadIcon />}
          variant="outline">
          DOWNLOAD CSV
        </Button>
      }>
      <div className="my-8 space-y-8">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
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
              <Td>Account</Td>
              <Td>Status</Td>
              <Td>Reason</Td>
              <Td className="text-right">Amount (RM)</Td>
              <Td className="text-right">Created on</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((adjustment, index) => (
                <Tr
                  key={index}
                  render={(props) => (
                    <Link
                      {...props}
                      to={`ledger-adjustments/${adjustment.id}`}
                      data-testid="ledger-adjustments-record"
                    />
                  )}>
                  <Td>{adjustment.attributes.account}</Td>
                  <Td>
                    <Badge color={(adjustment.status && ColorMap[adjustment.status]) || 'grey'}>
                      {adjustment.status}
                    </Badge>
                  </Td>
                  <Td>{adjustment.attributes.reason}</Td>
                  <Td className="text-right">{adjustment.amount}</Td>
                  <Td className="text-right">
                    {formatDate(adjustment.createdAt, {format: 'dd MMM yyyy'})}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const ColorMap: Record<LedgerTransactionStatus, BadgeProps['color']> = {
  [LedgerTransactionStatus.CANCELLED]: 'grey',
  [LedgerTransactionStatus.SUCCEEDED]: 'success',
  [LedgerTransactionStatus.REVERSED]: 'turquoise',
  [LedgerTransactionStatus.ERRORED]: 'error',
  [LedgerTransactionStatus.PENDING]: 'lemon',
  [LedgerTransactionStatus.FAILED]: 'grey',
};

enum LedgerAccounts {
  collection = 'setel-collection',
  trust = 'setel-mbb-trust1',
  operating = 'setel-operating',
  operatingCollection = 'operating-collection',
  customer = 'customer-aggregate',
  merchant = 'merchant-aggregate',
  buffer = 'buffer-aggregate',
  mdr = 'mdr-aggregate',
  merchantOperating = 'merchant-operating-aggregate',
  mdrOperating = 'mdr-operating-aggregate',
}

const ACCOUNT_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
].concat(
  Object.keys(LedgerAccounts).map((key) => ({
    label: camelToSentenceCase(key),
    value: LedgerAccounts[key],
  })),
);
