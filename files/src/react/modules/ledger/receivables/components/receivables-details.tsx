import {
  Badge,
  Button,
  CardHeading,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DownloadIcon,
  formatDate,
  formatMoney,
  JsonPanel,
  Pagination,
  PaginationNavigation,
  titleCase,
  usePaginationState,
} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {indexReceivableReconciliations} from 'src/react/services/api-ledger.service';
import {IReceivableException} from 'src/react/services/api-ledger.type';
import {getReconFileCSV} from 'src/react/services/api-processor.service';
import {
  FeeSettingTransactionTypes,
  TransactionPGVendors,
} from '../../fee-settings/fee-settings.enum';
import {TransactionTypes} from '../../ledger-transactions/ledger-transactions.enums';
import {ReceivableTypes} from '../receivables.enum';
import {
  useDailySummary,
  useReceivableExceptions,
  useReceivablesDetails,
} from '../receivables.queries';
import {ReceivablesExceptionModal} from './receivables-exception-modal';

type ReceivablesDetailsProps = {
  id: string;
};

export const ReceivablesDetails = (props: ReceivablesDetailsProps) => {
  const exceptionsPagination = usePaginationState();
  const {id} = props;

  const {
    query: {data: reconciliations},
    filter,
    pagination: reconciliationsPagination,
  } = useDataTableState({
    initialFilter: {
      isReconciled: '',
      transactionId: '',
    },
    queryKey: 'receivables-recon-filter',
    queryFn: (currentValues) =>
      indexReceivableReconciliations(id, {
        page: reconciliationsPagination.page,
        perPage: reconciliationsPagination.perPage,
        isReconciled:
          currentValues.isReconciled === 'true'
            ? true
            : currentValues.isReconciled === 'false'
            ? false
            : undefined,
        ...currentValues,
      }),
    components: [
      {
        key: 'isReconciled',
        type: 'select',
        props: {
          options: [
            {
              label: 'All statuses',
              value: '',
            },
            {
              label: 'Reconciled',
              value: 'true',
            },
            {
              label: 'Pending',
              value: 'false',
            },
          ],
          label: 'Status',
          'data-testid': 'status-filter',
        },
      },
      {
        key: 'transactionId',
        type: 'search',
        props: {
          label: 'Transaction ID',
          placeholder: 'Search transaction ID...',
          'data-testid': 'search-textbox',
        },
      },
    ],
  });

  const {data: details} = useReceivablesDetails(id);
  const {data: exceptions} = useReceivableExceptions(id, {
    page: exceptionsPagination.page,
    perPage: exceptionsPagination.perPage,
  });
  const {data: dailySummary} = useDailySummary({
    paymentGatewayVendor: details?.processorName,
    transactionDate: details?.transactionDate,
  });
  const [isReceivableModalVisible, setIsReceivableModalVisible] = React.useState<boolean>(false);
  const [selectedData, setSelectedData] = React.useState<IReceivableException>(null);

  const exceptionClickHandler = (exception: IReceivableException) => {
    setSelectedData(exception);
    setIsReceivableModalVisible(true);
  };

  return (
    <PageContainer
      className="pt-7"
      heading="Receivable details"
      action={
        <Button
          leftIcon={<DownloadIcon />}
          variant="outline"
          onClick={async () => {
            const csvData = await getReconFileCSV(
              details.processorName,
              details.receivableType,
              details.transactionDate,
            );

            downloadFile(
              csvData.data,
              csvData.headers['content-disposition'].match(/"(.*?)"/g)[0].replace(/"/g, ''),
            );
          }}>
          DOWNLOAD CSV
        </Button>
      }>
      <div className="-mt-0.5">
        <DataTable
          pagination={
            <Pagination
              currentPage={exceptionsPagination.page}
              pageSize={exceptionsPagination.perPage}
              onChangePage={exceptionsPagination.setPage}
              lastPage={exceptions?.pageCount}
              variant="page-list"
              onGoToLast={() => {}}
              onChangePageSize={exceptionsPagination.setPerPage}
            />
          }
          heading={<CardHeading title="Exceptions" />}>
          <DataTableRowGroup groupType="thead">
            <Td>Transaction date</Td>
            <Td>Reference ID</Td>
            <Td className="text-right">Amount (RM)</Td>
            <Td className="text-right">Fee (RM)</Td>
            <Td className="text-right">Reason</Td>
          </DataTableRowGroup>
          {exceptions && !exceptions.isEmpty ? (
            <DataTableRowGroup>
              {exceptions.items.map((exception) => (
                <Tr
                  key={`${exception.metadata.transId}-${exception.metadata.merchantRefNo}`}
                  data-testid="receivable-exception-record"
                  style={{cursor: 'pointer'}}
                  onClick={() => exceptionClickHandler(exception)}>
                  {isReceivableModalVisible && (
                    <ReceivablesExceptionModal
                      data={selectedData}
                      header={`Exception Details - ${selectedData.metadata.merchantRefNo}`}
                      onDismiss={() => setIsReceivableModalVisible(false)}
                    />
                  )}
                  <Td>
                    {exception.metadata.date &&
                      formatDate(exception.metadata.date, {formatType: 'dateAndTime'})}
                  </Td>
                  <Td>{exception.metadata.merchantRefNo}</Td>
                  <Td className="text-right">{formatMoney(exception.metadata.amount)}</Td>
                  <Td className="text-right">{formatMoney(exception.metadata.feeAmount)}</Td>
                  <Td className="text-right">{formatMoney(exception.reason)}</Td>
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
      </div>
      <div className="my-8">
        <DataTable heading={<CardHeading title="Fee summary" />}>
          <DataTableRowGroup groupType="thead">
            <Td>Transaction type</Td>
            <Td>No of transactions</Td>
            <Td>Payment option</Td>
            <Td>Card scheme</Td>
            <Td className="text-right">Expected fee (RM)</Td>
            <Td className="text-right">Actual fee (RM)</Td>
          </DataTableRowGroup>
          {dailySummary && dailySummary.length > 0 ? (
            <DataTableRowGroup>
              {dailySummary.map(
                (summary) =>
                  isMatchingFeeSummary(summary, details.receivableType) && (
                    <Tr key={summary.id} data-testid="summary-recon-record">
                      <Td>{titleCase(summary.transactionType, {hasUnderscore: true})}</Td>
                      <Td>{summary.count}</Td>
                      <Td>{titleCase(summary.paymentOption, {hasUnderscore: true})}</Td>
                      <Td>{summary.cardScheme}</Td>
                      <Td className="text-right">{formatMoney(summary.feeAmount)}</Td>
                      <Td className="text-right">{formatMoney(summary.paymentGatewayFeeAmount)}</Td>
                    </Tr>
                  ),
              )}
            </DataTableRowGroup>
          ) : (
            <DataTableCaption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available.</p>
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </div>
      <div className="my-8">
        <DataTable
          pagination={
            <PaginationNavigation
              total={reconciliations?.total}
              currentPage={reconciliationsPagination.page}
              perPage={reconciliationsPagination.perPage}
              onChangePage={reconciliationsPagination.setPage}
              onChangePageSize={reconciliationsPagination.setPerPage}
            />
          }
          filter={filter}
          heading={<CardHeading title="Reconciliations" />}>
          <DataTableRowGroup groupType="thead">
            <Td>Transaction ID</Td>
            <Td>Status</Td>
            <Td className="text-right">Amount (RM)</Td>
            <Td className="text-right">Fee (RM)</Td>
            <Td className="text-right">Created on</Td>
          </DataTableRowGroup>
          {reconciliations && !reconciliations.isEmpty ? (
            <DataTableRowGroup>
              {reconciliations.items.map((reconciliation) => (
                <Tr
                  key={reconciliation.transactionId}
                  render={(props) => (
                    <Link
                      to={`/ledger-transactions/${reconciliation.transactionId}`}
                      data-testid="receivable-recon-record"
                      {...props}
                    />
                  )}>
                  <Td>{reconciliation.transactionId}</Td>
                  <Td>
                    <Badge color={reconciliation.isReconciled ? 'success' : 'lemon'}>
                      {reconciliation.isReconciled ? 'RECONCILED' : 'PENDING'}
                    </Badge>
                  </Td>
                  <Td className="text-right">{formatMoney(reconciliation.amount)}</Td>
                  <Td className="text-right">{formatMoney(reconciliation.feeAmount)}</Td>
                  <Td className="text-right">
                    {formatDate(reconciliation.createdAt.toString(), {
                      formatType: 'dateAndTime',
                    })}
                  </Td>
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
      </div>
      <div className="my-8">
        <JsonPanel json={details as any} allowToggleFormat defaultOpen defaultIsPretty />
      </div>
    </PageContainer>
  );
};

const isMatchingFeeSummary = (feeSummary, receivableType: ReceivableTypes) => {
  const {paymentGatewayVendor, transactionType} = feeSummary;
  switch (receivableType) {
    case ReceivableTypes.WALLET_SETEL:
      if (paymentGatewayVendor === TransactionPGVendors.IPAY88) {
        if (
          transactionType === TransactionTypes.TOPUP ||
          transactionType === TransactionTypes.TOPUP_REFUND
        ) {
          return true;
        }
      }
      break;
    case ReceivableTypes.PASSTHROUGH_FUEL:
      if (paymentGatewayVendor === TransactionPGVendors.IPAY88) {
        if (
          transactionType === FeeSettingTransactionTypes.PASSTHROUGH_FUEL ||
          transactionType === FeeSettingTransactionTypes.PASSTHROUGH_FUEL_REFUND
        ) {
          return true;
        }
      }
      break;
    case ReceivableTypes.PASSTHROUGH_STORE:
      if (paymentGatewayVendor === TransactionPGVendors.IPAY88) {
        if (
          transactionType === FeeSettingTransactionTypes.PASSTHROUGH_STORE ||
          transactionType === FeeSettingTransactionTypes.PASSTHROUGH_STORE_REFUND
        ) {
          return true;
        }
      }
      break;
    case ReceivableTypes.BOOST:
      if (paymentGatewayVendor === TransactionPGVendors.BOOST) {
        if (
          transactionType === FeeSettingTransactionTypes.CHARGE_BOOST ||
          transactionType === FeeSettingTransactionTypes.REFUND_BOOST
        ) {
          return true;
        }
      }
      break;
    case ReceivableTypes.BOOST_TOPUP:
      if (paymentGatewayVendor === TransactionPGVendors.BOOST) {
        if (
          transactionType === FeeSettingTransactionTypes.TOPUP_BOOST ||
          transactionType === FeeSettingTransactionTypes.TOPUP_REFUND_BOOST
        ) {
          return true;
        }
      }
      break;
    default:
      return false;
  }
};
