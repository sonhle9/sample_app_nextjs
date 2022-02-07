import {
  DataTable as Table,
  PaginationNavigation,
  usePaginationState,
  Button,
  FilterControls,
  formatMoney,
  Badge,
  formatDate,
  DownloadIcon,
  useFilter,
  Filter,
} from '@setel/portal-ui';
import * as React from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useNotification} from 'src/react/hooks/use-notification';
import {
  COLLECTION_TYPE_OPTIONS,
  COLLECTION_STATUS_OPTION,
  CATEGORY_TYPE_PDB_OPTIONS,
  CATEGORY_TYPE_SETEL_OPTIONS,
} from '../api-collections.type';
import {PageContainer} from '../../../components/page-container';
import {useListCollections} from '../collections.queries';
import {TRANSACTION_STATUS_NAME, TRANSACTION_STATUS_COLOR, CATEGORY_NAME} from '../constants';
import {CollectionsSendEmailModal} from './collections-send-email-modal';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {Transaction} from '../collections.type';
import {environment} from 'src/environments/environment';
import {useHasPermission} from '../../auth/HasPermission';
import {transactionReportRole} from 'src/shared/helpers/roles.type';

export const ColllectionsListing = () => {
  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  const {page, setPage, perPage, setPerPage} = usePaginationState();

  const categoryOptional =
    environment.enterprise === 'setel' ? CATEGORY_TYPE_SETEL_OPTIONS : CATEGORY_TYPE_PDB_OPTIONS;

  const filter = useFilter(
    {
      types: '',
      status: '',
      category: '',
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
          key: 'category',
          type: 'select',
          props: {
            label: 'Collection category',
            placeholder: 'Any category',
            options: categoryOptional,
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
      ],
      onChange: () => {
        setPage(1);
      },
    },
  );

  const [{values}] = filter;
  const [sendEmailModal, setSendEmailModal] = React.useState(false);
  const showMsg = useNotification();

  const {data, isFetching, isLoading, isError, error} = useListCollections({
    page,
    perPage,
    types: values.types,
    status: values.status,
    category: values.category,
    filterByTime: 'createdAt',
    timeFrom: values.range[0],
    timeTo: values.range[1],
  });

  const canDownloadReport = useHasPermission([transactionReportRole.download]);

  const isEmpty = !isLoading && data?.transactions.length === 0;

  const getDetailTransactionUrl = (transaction: Transaction): string => {
    return `${webDashboardUrl}/payments/transactions?merchantId=${transaction.merchantId}&transactionId=${transaction.transactionUid}&redirect-from=admin`;
  };

  return (
    <div>
      <PageContainer
        heading={'Collections'}
        action={
          canDownloadReport && (
            <Button
              onClick={() => setSendEmailModal(true)}
              leftIcon={<DownloadIcon />}
              variant="outline">
              DOWNLOAD CSV
            </Button>
          )
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
              <Table.Td className={'text-right w-1/8'}>Amount (RM)</Table.Td>
              <Table.Td className={'w-1/8'}>Status</Table.Td>
              <Table.Td className={'w-1/4'}>Collection category</Table.Td>
              <Table.Td className={'w-1/4'}>Merchant name</Table.Td>
              <Table.Td className={'text-right w-1/4'}>Created on</Table.Td>
            </Table.Tr>
          </Table.Thead>
          {!isEmpty && (
            <Table.Tbody>
              {data?.transactions.map((transaction) => (
                <Table.Tr
                  render={(props) => (
                    <a target="_blank" href={getDetailTransactionUrl(transaction)} {...props} />
                  )}
                  key={transaction?.id}>
                  <Table.Td className={'text-right'}>
                    {formatMoney(transaction?.amount, '')}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={TRANSACTION_STATUS_COLOR[transaction?.status]}>
                      {TRANSACTION_STATUS_NAME[transaction?.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{CATEGORY_NAME[transaction?.subType]}</Table.Td>
                  <Table.Td>
                    {(transaction?.attributes && transaction?.attributes?.merchantName) ||
                      `ID: ${transaction?.merchantId}`}
                  </Table.Td>
                  <Table.Td className={'text-right'}>{formatDate(transaction.createdAt)}</Table.Td>
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
        <CollectionsSendEmailModal
          filter={values}
          visible={sendEmailModal}
          onClose={() => {
            setSendEmailModal(false);
          }}
          onSuccessSendEmail={() => {
            showMsg({
              title: 'Request successfully',
              description: 'The report will be sent shortly.',
            });
          }}
        />
      )}
    </div>
  );
};
