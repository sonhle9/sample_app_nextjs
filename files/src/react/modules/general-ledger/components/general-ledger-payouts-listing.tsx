import {
  Alert,
  Badge,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DateRangeDropdown,
  DropdownSelect,
  FieldContainer,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  PaginationNavigation,
  titleCase,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {downloadFile} from 'src/react/lib/utils';
import {GeneralLedgerPayoutsStatus} from 'src/react/services/api-processor.enum';
import {getGeneralLedgerPayoutsBatchCSV} from 'src/react/services/api-processor.service';
import {useGLPayouts} from '../general-ledger.queries';

export const GeneralLedgerPayoutsListing = () => {
  const [{values, applied}, {setValueCurry, setValue, reset}] = useFilter({
    status: STATUS_OPTIONS[0].value as GeneralLedgerPayoutsStatus,
    from: '',
    to: '',
  });

  const pagination = usePaginationState();
  const {
    data: resolvedData,
    isLoading,
    isError,
  } = useGLPayouts({
    page: pagination.page,
    perPage: pagination.perPage,
    ...values,
  });

  const downloadCsv = async () => {
    const csvData = await getGeneralLedgerPayoutsBatchCSV(values.status, values.from, values.to);
    downloadFile(
      csvData,
      `gl-payouts-list-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
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
        <FilterControls>
          <FieldContainer label="Status" layout="vertical">
            <DropdownSelect
              value={values.status}
              onChangeValue={setValueCurry('status')}
              options={STATUS_OPTIONS}
            />
          </FieldContainer>
          <FieldContainer label="Date" layout="vertical">
            <DateRangeDropdown
              customRangeFormatType="dateAndTime"
              value={[values.from, values.to]}
              onChangeValue={(value) => {
                setValue('from', value[0]);
                setValue('to', value[1]);
              }}
            />
          </FieldContainer>
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
              <Td>Transaction Date</Td>
              <Td>Status</Td>
              <Td>Processor Name</Td>
              <Td>Payout Type</Td>
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
                    <Link
                      to={`/general-ledger-payouts/${parameter.id}`}
                      data-testid="gl-code-record"
                      {...props}
                    />
                  )}>
                  <Td>{formatDate(parameter.transactionDate, {formatType: 'dateOnly'})}</Td>
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
                  <Td>{parameter.type}</Td>
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
  [GeneralLedgerPayoutsStatus.PARTIAL_COMPLETED]: 'lemon',
  [GeneralLedgerPayoutsStatus.PAYMENT_FILE_SUBMITTED]: 'lemon',
  [GeneralLedgerPayoutsStatus.ACK_SUCCEEDED]: 'lemon',
  [GeneralLedgerPayoutsStatus.COMPLETED]: 'success',
  [GeneralLedgerPayoutsStatus.ACK_REJECTED]: 'error',
  [GeneralLedgerPayoutsStatus.ACK_INVALID]: 'error',
  [GeneralLedgerPayoutsStatus.ACK_PARTIAL_REJECTED]: 'error',
  [GeneralLedgerPayoutsStatus.PAYMENT_FILE_PROCESSING]: 'lemon',
} as const;

const displayStatus = {
  [GeneralLedgerPayoutsStatus.PARTIAL_COMPLETED]: 'PARTIAL COMPLETED',
  [GeneralLedgerPayoutsStatus.PAYMENT_FILE_SUBMITTED]: 'SUBMITTED',
  [GeneralLedgerPayoutsStatus.ACK_SUCCEEDED]: 'ACK SUCCEEDED',
  [GeneralLedgerPayoutsStatus.COMPLETED]: 'COMPLETED',
  [GeneralLedgerPayoutsStatus.ACK_REJECTED]: 'ACK REJECTED',
  [GeneralLedgerPayoutsStatus.ACK_INVALID]: 'ACK INVALID',
  [GeneralLedgerPayoutsStatus.ACK_PARTIAL_REJECTED]: 'ACK PARTIAL REJECTED',
  [GeneralLedgerPayoutsStatus.PAYMENT_FILE_PROCESSING]: 'PROCESSING',
} as const;

const STATUS_OPTIONS = [
  {
    label: 'All',
    value: '' as any,
  },
].concat(
  Object.keys(GeneralLedgerPayoutsStatus).map((key) => ({
    label: titleCase(GeneralLedgerPayoutsStatus[key], {hasUnderscore: true}),
    value: key,
  })),
);
