import {
  Badge,
  Button,
  DataTable as Table,
  DownloadIcon,
  formatDate,
  formatMoney,
  PaginationNavigation,
  usePaginationState,
  Filter,
  useFilter,
  FilterControls,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {transactionReportRole} from 'src/shared/helpers/roles.type';
import {useHasPermission} from '../../auth/HasPermission';
import {
  FEE_STATUS_OPTION,
  FEES_STATUS_COLOR,
  FEES_STATUS_NAME,
  FEE_TYPE_OPTION,
} from '../fees.constant';
import {useFees} from '../fees.queries';
import {IFee} from '../fees.type';
import {FeesSendEmailModal} from './fees-send-email-modal';

export default function FeesListing() {
  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  const [sendEmailModal, setSendEmailModal] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const filter = useFilter(
    {
      status: '',
      type: '',
      range: ['', ''],
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            placeholder: 'Any status',
            options: FEE_STATUS_OPTION,
            wrapperClass: 'lg:col-span-1',
          },
        },
        {
          key: 'type',
          type: 'select',
          props: {
            label: 'Type',
            placeholder: 'Any type',
            options: FEE_TYPE_OPTION,
            wrapperClass: 'lg:col-span-1',
          },
        },
        {
          key: 'range',
          type: 'daterange',
          props: {
            label: 'Created on',
            placeholder: 'Any date',
            dayOnly: true,
            wrapperClass: 'lg:col-span-2',
          },
        },
      ],
      onChange: () => setPage(1),
    },
  );

  const [{values}] = filter;

  const {data, error, isLoading, isError, isFetching} = useFees({
    status: values.status,
    type: values.type,
    filterByTime: 'createdAt',
    timeFrom: values.range[0],
    timeTo: values.range[1],
    page,
    perPage,
  });

  const getDetailTransactionUrl = (fee: IFee): string => {
    return `${webDashboardUrl}/payments/transactions?merchantId=${fee.merchantId}&transactionId=${fee.transactionUid}&redirect-from=admin`;
  };

  const isEmptyFeeList = !isLoading && data?.fees?.length === 0;
  const canDownloadReport = useHasPermission([transactionReportRole.download]);

  return (
    <div>
      <PageContainer
        heading="Fees"
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
          <FilterControls filter={filter} className="grid gap-2 lg:grid-cols-4 md:grid-cols-1" />
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
              <Table.Td>Merchant Name</Table.Td>
              <Table.Td className="text-right w-1/4">Created on</Table.Td>
            </Table.Tr>
          </Table.Thead>

          {!isEmptyFeeList && (
            <Table.Tbody>
              {data?.fees?.map((fee) => (
                <Table.Tr
                  key={fee.transactionUid}
                  render={(props) => (
                    <a target="_blank" href={getDetailTransactionUrl(fee)} {...props} />
                  )}>
                  <Table.Td className="text-right">{formatMoney(fee?.amount, '')}</Table.Td>
                  <Table.Td>
                    <Badge color={FEES_STATUS_COLOR[fee?.status]}>
                      {FEES_STATUS_NAME[fee?.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{fee?.attributes?.merchantName || `ID: ${fee?.merchantId}`}</Table.Td>
                  <Table.Td className="text-right">{formatDate(fee?.createdAt)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          )}
          {isEmptyFeeList && (
            <Table.Caption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No fee was found</p>
              </div>
            </Table.Caption>
          )}
        </Table>
      </PageContainer>

      {sendEmailModal && (
        <FeesSendEmailModal
          filter={values}
          visible={sendEmailModal}
          onClose={() => {
            setSendEmailModal(false);
          }}
        />
      )}
    </div>
  );
}
