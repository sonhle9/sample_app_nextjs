import {
  DataTable as Table,
  PaginationNavigation,
  usePaginationState,
  Button,
  FilterControls,
  DownloadIcon,
  formatMoney,
  Badge,
  formatDate,
  useFilter,
  Filter,
} from '@setel/portal-ui';
import * as React from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {PageContainer} from '../../../components/page-container';
import {useListCollections} from '../reload-transactions.queries';
import {SendEmailModal} from './send-email-modal';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {
  Transaction,
  TRANSACTION_STATUS_COLOR,
  COLLECTION_TYPE_OPTIONS,
  COLLECTION_STATUS_OPTION,
  TRANSACTION_STATUS_NAME,
  TRANSACTION_TYPE_NAME,
  RELOAD_NAME_OPTIONS,
} from '../reload-transactions.type';

export const ReloadTransactionsListing = () => {
  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  const {page, setPage, perPage, setPerPage} = usePaginationState();
  const [sendEmailModal, setSendEmailModal] = React.useState(false);

  const filter = useFilter(
    {
      types: '',
      status: '',
      search: '',
      reloadName: '',
      range: ['', ''],
    },
    {
      components: [
        {
          key: 'types',
          type: 'select',
          props: {
            label: 'Type',
            placeholder: 'Any type',
            options: COLLECTION_TYPE_OPTIONS,
          },
        },
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            placeholder: 'Any status',
            options: COLLECTION_STATUS_OPTION,
          },
        },
        {
          key: 'reloadName',
          type: 'select',
          props: {
            label: 'Reload',
            placeholder: 'Any reload name',
            options: RELOAD_NAME_OPTIONS,
          },
        },
        {
          key: 'range',
          type: 'daterange',
          props: {
            label: 'Created on',
            dayOnly: true,
          },
        },
        {
          key: 'search',
          type: 'search',
          props: {
            label: 'Search',
            placeholder: 'Search transaction',
            wrapperClass: 'md:col-span-2',
          },
        },
      ],
      onChange: () => {
        setPage(1);
      },
    },
  );
  const [{values}] = filter;

  const {data, isFetching, isLoading, isError, error} = useListCollections({
    search: values.search,
    page,
    perPage,
    types: values.types,
    status: values.status,
    reloadName: values.reloadName,
    filterByTime: 'createdAt',
    timeFrom: values.range[0],
    timeTo: values.range[1],
  });
  const isEmpty = !isLoading && data?.transactions?.length === 0;
  const getDetailTransactionUrl = (transaction: Transaction): string => {
    return `${webDashboardUrl}/bills-and-reloads/transactions?merchantId=${transaction.merchantId}&transactionId=${transaction.transactionUid}&redirect-from=admin`;
  };

  return (
    <div>
      <PageContainer
        heading="Reload transactions"
        action={
          <Button
            disabled={isLoading}
            onClick={() => setSendEmailModal(true)}
            leftIcon={<DownloadIcon />}
            variant="outline">
            DOWNLOAD CSV
          </Button>
        }>
        <div className="mb-8 space-y-8">
          <FilterControls filter={filter} className="grid gap-4 md:grid-cols-4 sm:grid-cols-1" />
          <Filter filter={filter} />
        </div>

        {isError && <QueryErrorAlert error={error as any} />}
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data && (
              <PaginationNavigation
                total={data && data.total}
                currentPage={page}
                perPage={perPage}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Td className="w-1/6 text-right">Amount (RM)</Table.Td>
              <Table.Td className="w-1/6">Status</Table.Td>
              <Table.Td className="w-1/6">Type</Table.Td>
              <Table.Td className="w-1/4">Merchant</Table.Td>
              <Table.Td className="text-right">Created on</Table.Td>
            </Table.Tr>
          </Table.Thead>

          {!isEmpty && (
            <Table.Tbody>
              {data?.transactions.map((transaction) => (
                <Table.Tr
                  render={(props) => (
                    <a target="_blank" href={getDetailTransactionUrl(transaction)} {...props} />
                  )}
                  key={transaction.id}>
                  <Table.Td className="text-right">{formatMoney(transaction.amount, '')}</Table.Td>
                  <Table.Td>
                    <Badge color={TRANSACTION_STATUS_COLOR[transaction?.status]}>
                      {TRANSACTION_STATUS_NAME[transaction?.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{TRANSACTION_TYPE_NAME[transaction.type]}</Table.Td>
                  <Table.Td>
                    {transaction?.attributes?.merchantName || `ID: ${transaction?.merchantId}`}
                  </Table.Td>
                  <Table.Td className="text-right">{formatDate(transaction.createdAt)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          )}
          {isEmpty && (
            <Table.Caption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No transaction was found</p>
              </div>
            </Table.Caption>
          )}
        </Table>
      </PageContainer>

      {sendEmailModal && (
        <SendEmailModal
          page={page}
          perPage={perPage}
          status={values.status}
          timeFrom={values.range[0]}
          timeTo={values.range[1]}
          type={values.types}
          types={values.types}
          visible={sendEmailModal}
          onClose={() => {
            setSendEmailModal(false);
          }}
        />
      )}
    </div>
  );
};
