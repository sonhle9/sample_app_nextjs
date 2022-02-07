import {
  Alert,
  Badge,
  Button,
  Filter,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DownloadIcon,
  FilterControls,
  titleCase,
  formatDate,
  formatMoney,
  Pagination,
} from '@setel/portal-ui';
import * as React from 'react';
import {useState} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {
  getLedgerTransactions,
  getLedgerTransactionsCSV,
} from 'src/react/services/api-ledger.service';
import {convertToOptions} from '../../fee-settings/fee-settings.const';
import {
  LedgerTransactionStatus,
  TransactionSubTypes,
  TransactionTypes,
} from '../ledger-transactions.enums';

export const LedgerTransactionsListing = () => {
  const [currentType, setCurrentType] = useState(null);
  const {
    query: {data: resolvedData, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      type: '' as TransactionTypes,
      subType: '' as TransactionSubTypes,
      status: '' as LedgerTransactionStatus,
      range: ['', ''] as [string, string],
    },
    queryKey: 'ledger-transaction-filter',
    onChange: (newValues) => {
      setCurrentType(newValues.type);
      if (newValues.type !== currentType) {
        filter[1].setValue('subType', '' as TransactionSubTypes);
      }
    },
    queryFn: (currentValues) => {
      const {
        range: [from, to],
        ...currentFilter
      } = currentValues;
      return getLedgerTransactions({...currentFilter, from, to});
    },
    components: (values) => [
      {
        key: 'type',
        type: 'select',
        props: {
          options: TYPE_OPTIONS,
          label: 'Type',
          'data-testid': 'type-filter',
        },
      },
      {
        key: 'subType',
        type: 'select',
        props: {
          options: LEDGER_TRANSACTION_TYPE_OPTIONS[values.type || 'ALL'].subType,
          disabled: values.type === TYPE_OPTIONS[0].value ? true : false,
          label: 'Sub type',
          'data-testid': 'subtype-filter',
        },
      },
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
        key: 'range',
        type: 'daterange',
        props: {
          customRangeFormatType: 'dateAndTime',
          label: 'Transaction Date',
        },
      },
    ],
  });

  const [{values, applied}, {reset}] = filter;
  return (
    <PageContainer
      heading="Ledger transactions"
      action={
        <Button
          disabled={resolvedData && resolvedData.isEmpty}
          leftIcon={<DownloadIcon />}
          onClick={async () => {
            const [from, to] = values.range;
            const csvData = await getLedgerTransactionsCSV({to, from, ...values});
            downloadFile(
              csvData,
              `ledger-transaction-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
            );
          }}
          variant="outline">
          DOWNLOAD
        </Button>
      }>
      <div className="my-8 space-y-8">
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
            <Pagination
              currentPage={pagination.page}
              onChangePage={pagination.setPage}
              pageSize={pagination.perPage}
              lastPage={resolvedData?.pageCount}
              onChangePageSize={pagination.setPerPage}
              onGoToLast={() => {}}
              variant="prev-next"
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Transaction ID</Td>
              <Td>Status</Td>
              <Td>Type</Td>
              <Td>Sub type</Td>
              <Td className="text-right">Amount (RM)</Td>
              <Td className="text-right">Transaction Date</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((transaction) => (
                <Tr
                  key={transaction.id}
                  render={(props) => (
                    <Link
                      to={`/ledger-transactions/${transaction.id}`}
                      data-testid="ledger-transactions-record"
                      {...props}
                    />
                  )}>
                  <Td>{transaction.transactionId}</Td>
                  <Td>
                    <Badge rounded="rounded" color={statusColorMap[transaction.status]}>
                      {transaction.status}
                    </Badge>
                  </Td>
                  <Td>{transaction.type}</Td>
                  <Td>{transaction.subType}</Td>
                  <Td className="text-right">{formatMoney(transaction.amount)}</Td>
                  <Td className="text-right">
                    {formatDate(transaction.createdAt, {formatType: 'dateAndTime'})}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const statusColorMap: Record<LedgerTransactionStatus, any> = {
  SUCCEEDED: 'success',
  PENDING: 'lemon',
  ERRORED: 'error',
  FAILED: 'error',
  CANCELLED: 'error',
  REVERSED: 'error',
};

const TYPE_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
].concat(
  Object.keys(TransactionTypes).map((key) => ({
    label: titleCase(TransactionTypes[key], {hasUnderscore: true}),
    value: TransactionTypes[key],
  })),
);

const SUBTYPE_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
].concat(
  Object.keys(TransactionSubTypes).map((key) => ({
    label: titleCase(TransactionSubTypes[key], {hasUnderscore: true}),
    value: TransactionSubTypes[key],
  })),
);

const STATUS_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
].concat(
  Object.keys(LedgerTransactionStatus).map((key) => ({
    label: titleCase(LedgerTransactionStatus[key]),
    value: LedgerTransactionStatus[key],
  })),
);

const LEDGER_TRANSACTION_TYPE_OPTIONS = {
  ALL: {
    subType: SUBTYPE_OPTIONS,
  },
  [TransactionTypes.TOPUP as string]: {
    subType: convertToOptions({
      TOPUP_BANK_ACCOUNT: 'TOPUP_BANK_ACCOUNT',
      TOPUP_CREDIT_CARD: 'TOPUP_CREDIT_CARD',
      TOPUP_DIGITAL_WALLET: 'TOPUP_DIGITAL_WALLET',
    }),
  },
  [TransactionTypes.TOPUP_REFUND as string]: {
    subType: convertToOptions({
      TOPUP_REFUND_DIGITAL_WALLET: 'TOPUP_REFUND_DIGITAL_WALLET',
      TOPUP_REFUND_BANK_ACCOUNT: 'TOPUP_REFUND_BANK_ACCOUNT',
      TOPUP_REFUND_CREDIT_CARD: 'TOPUP_REFUND_CREDIT_CARD',
    }),
  },
  [TransactionTypes.ADJUSTMENT as string]: {
    subType: convertToOptions({
      ADJUSTMENT_WALLET: 'ADJUSTMENT_WALLET',
      ADJUSTMENT_LEDGER: 'ADJUSTMENT_LEDGER',
      ADJUSTMENT_TOPUP: 'ADJUSTMENT_TOP_UP',
      ADJUSTMENT_CHARGE: 'ADJUSTMENT_CHARGE',
      ADJUSTMENT_MDR_CHARGE: 'ADJUSTMENT_MDR_CHARGE',
      ADJUSTMENT_PREFUND: 'ADJUSTMENT_PREFUND',
      ADJUSTMENT_MIGRATE_BALANCE: 'ADJUSTMENT_MIGRATE_BALANCE',
      ADJUSTMENT_OTHER: 'ADJUSTMENT_OTHER',
    }),
  },
  [TransactionTypes.CHARGE as string]: {
    subType: convertToOptions({
      CHARGE_WALLET: 'CHARGE_WALLET',
      CHARGE_CARD: 'CHARGE_CARD',
      CHARGE_BOOST: 'CHARGE_BOOST',
    }),
  },
  [TransactionTypes.FEE as string]: {
    subType: convertToOptions({
      FEE_IPAY88: 'FEE_IPAY88',
      FEE_BOOST: 'FEE_BOOST',
      CHARGE_WALLET: 'CHARGE_WALLET',
      CHARGE_CARD: 'CHARGE_CARD',
      CHARGE_BOOST: 'CHARGE_BOOST',
    }),
  },
  [TransactionTypes.PAYOUT as string]: {
    subType: convertToOptions({}),
  },
  [TransactionTypes.REFUND as string]: {
    subType: convertToOptions({
      REFUND_WALLET: 'REFUND_WALLET',
      REFUND_CARD: 'REFUND_CARD',
      REFUND_BOOST: 'REFUND_BOOST',
    }),
  },
  [TransactionTypes.SWEEP as string]: {
    subType: convertToOptions({
      SWEEP_COLLECTION: 'SWEEP_COLLECTION',
      SWEEP_OPERATING_COLLECTION: 'SWEEP_OPERATING_COLLECTION',
    }),
  },
  [TransactionTypes.TRANSFER as string]: {
    subType: convertToOptions({
      TRANSFER_MERCHANT_BONUS_WALLET: 'TRANSFER_MERCHANT_BONUS_WALLET',
      TRANSFER_REFUND_MERCHANT_BONUS_WALLET: 'TRANSFER_REFUND_MERCHANT_BONUS_WALLET',
      TRANSFER_MERCHANT_TO_PREPAID: 'TRANSFER_MERCHANT_TO_PREPAID',
      TRANSFER_TRUST_TO_OPERATING: 'TRANSFER_TRUST_TO_OPERATING',
    }),
  },
};
