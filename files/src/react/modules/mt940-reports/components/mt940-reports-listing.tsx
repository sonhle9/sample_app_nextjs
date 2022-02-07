import {
  Alert,
  Badge,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DateRangeDropdown,
  DownloadIcon,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  PaginationNavigation,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {getMT940ReportsCSV} from 'src/react/services/api-processor.service';
import {useMT940ReportsListing} from '../mt940-reports.queries';

type MT940ReportsListingProps = {
  account: 'COLLECTION' | 'OPERATING';
};

export const MT940ReportsListing = (props: MT940ReportsListingProps) => {
  const [{values, applied}, {setValue, reset}] = useFilter({
    from: '',
    to: '',
  });

  const pagination = usePaginationState();
  const {
    data: resolvedData,
    isLoading,
    isError,
  } = useMT940ReportsListing({
    page: pagination.page,
    perPage: pagination.perPage,
    account: props.account,
    ...values,
  });

  return (
    <PageContainer
      heading={`MT940 for ${props.account.toLocaleLowerCase()} account report`}
      action={
        <Button
          leftIcon={<DownloadIcon />}
          onClick={async () => {
            const csvData = await getMT940ReportsCSV(props.account, values.from, values.to);
            downloadFile(
              csvData,
              `mt940-reports-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
            );
          }}
          variant="outline">
          DOWNLOAD CSV
        </Button>
      }>
      <div className="mb-8 space-y-8">
        <FilterControls>
          <DateRangeDropdown
            customRangeFormatType="dateAndTime"
            label="File Date"
            value={[values.from, values.to]}
            onChangeValue={(value) => {
              setValue('from', value[0]);
              setValue('to', value[1]);
            }}
          />
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
              <Td>File Date</Td>
              <Td className="text-right">Opening Balance (RM)</Td>
              <Td className="text-right">Debit Amount (RM)</Td>
              <Td className="text-right">Credit Amount (RM)</Td>
              <Td className="text-right">Closing Balance (RM)</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((report) => (
                <Tr
                  key={report.id}
                  render={(trProps) => (
                    <Link
                      to={`/treasury-reports/mt940/${props.account}/${report.id}`}
                      data-testid="gl-code-record"
                      {...trProps}
                    />
                  )}>
                  <Td>{formatDate(report.fileDate, {format: 'dd MMM yyyy'})}</Td>
                  <Td className="text-right">{formatMoney(report.balance.opening.amount)}</Td>
                  <Td className="text-right">{formatMoney(report.debit.amount)}</Td>
                  <Td className="text-right">{formatMoney(report.credit.amount)}</Td>
                  <Td className="text-right">{formatMoney(report.balance.closing.amount)}</Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};
