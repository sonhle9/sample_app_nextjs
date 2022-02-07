import {
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  JsonPanel,
  usePaginationState,
  PaginationNavigation,
  Alert,
  titleCase,
  formatDate,
  formatMoney,
  CardHeading,
  FieldContainer,
  DropdownSelect,
  Button,
  Badge,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {PayoutStatus} from 'src/react/services/api-processor.enum';
import {downloadFile} from 'src/react/lib/utils';
import {getPayoutsDetailsCSV} from 'src/react/services/api-processor.service';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {usePayoutByBatchId, usePayoutsDetails} from '../payouts.queries';

export interface IPayoutsDetailsProps {
  id: string;
}

export const PayoutsDetails = (props: IPayoutsDetailsProps) => {
  const [status, setStatus] = React.useState(FILTER_STATUS[0].value);

  const WEB_DASHBOARD_URL = CURRENT_ENTERPRISE.dashboardUrl;
  const {id} = props;
  const {data} = usePayoutsDetails(id);
  const transactionsPagination = usePaginationState();
  const {
    data: transactionsData,
    isError: isTransactionsError,
    isLoading: isTransactionsLoading,
  } = usePayoutByBatchId({
    page: transactionsPagination.page,
    perPage: transactionsPagination.perPage,
    status,
    batchId: id,
  });

  const downloadCsv = async () => {
    const csvData = await getPayoutsDetailsCSV(id, status);
    downloadFile(csvData, `payouts-list-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`);
  };

  const noRecord = !transactionsData || transactionsData.isEmpty;

  return (
    <PageContainer
      heading="Payouts Batch Details"
      action={
        <Button disabled={noRecord} onClick={downloadCsv} variant="outline">
          DOWNLOAD CSV
        </Button>
      }>
      <JsonPanel defaultOpen allowToggleFormat json={data as any} className="mb-8" />
      <div className="my-8" />
      {isTransactionsError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          heading={
            <CardHeading title="Transactions">
              <FieldContainer label="Status" layout="horizontal" className="mb-0">
                <DropdownSelect
                  value={status}
                  onChangeValue={(val) => setStatus(val)}
                  options={FILTER_STATUS}
                  className="w-48 ml-2"
                />
              </FieldContainer>
            </CardHeading>
          }
          isLoading={isTransactionsLoading}
          pagination={
            transactionsData && (
              <PaginationNavigation
                total={transactionsData.total}
                currentPage={transactionsPagination.page}
                perPage={transactionsPagination.perPage}
                onChangePage={transactionsPagination.setPage}
                onChangePageSize={transactionsPagination.setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Transaction Date</Td>
              <Td>Status</Td>
              <Td>Merchant</Td>
              <Td>Paid To</Td>
              <Td className="text-right">Amount (RM)</Td>
              <Td className="text-right">Fee (RM)</Td>
              <Td>Reason</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {transactionsData &&
              transactionsData.items.map((parameter) => (
                <Tr
                  key={parameter.id}
                  render={(pr) => (
                    <a
                      href={`${WEB_DASHBOARD_URL}/payments/settlements?merchantId=${parameter.merchantId}&settlementId=${parameter.settlementId}`}
                      target="_BLANK"
                      data-testid="gl-code-record"
                      {...pr}
                    />
                  )}>
                  <Td>{formatDate(parameter.transactionDate, {format: 'dd MMM yyyy'})}</Td>
                  <Td>
                    <Badge
                      color={transactionStatusColorMap[parameter.status]}
                      rounded="rounded"
                      className="uppercase">
                      {displayStatus[parameter.status]}
                    </Badge>
                  </Td>
                  <Td>{parameter.merchantName}</Td>
                  <Td>{titleCase(parameter.bankName, {hasUnderscore: true})}</Td>
                  <Td className="text-right">{formatMoney(parameter.amount)}</Td>
                  <Td className="text-right">{formatMoney(parameter.feeAmount)}</Td>
                  <Td>{parameter.error}</Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const FILTER_STATUS = [
  {
    label: 'All',
    value: '' as any,
  },
].concat(
  Object.keys(PayoutStatus).map((key) => ({
    label: titleCase(PayoutStatus[key], {hasUnderscore: true}),
    value: key,
  })),
);

const transactionStatusColorMap = {
  [PayoutStatus.FAILED]: 'error',
  [PayoutStatus.PROCESSING]: 'lemon',
  [PayoutStatus.PENDING_FOR_BANK]: 'lemon',
  [PayoutStatus.SUCCEEDED]: 'success',
} as const;

const displayStatus = {
  [PayoutStatus.FAILED]: 'Failed',
  [PayoutStatus.PROCESSING]: 'Processing',
  [PayoutStatus.PENDING_FOR_BANK]: 'Pending',
  [PayoutStatus.SUCCEEDED]: 'Succeeded',
} as const;
