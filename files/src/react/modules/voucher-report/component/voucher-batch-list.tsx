import {
  Alert,
  Filter,
  FilterControls,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  formatDate,
  DownloadIcon,
  Button,
  DataTableCaption,
} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {downloadFile} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {getVoucherBatches, getVouchersBatchesReport} from '../voucher.service';

export const VoucherBatchList = () => {
  const {
    query: {data: resolvedData, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      name: '',
    },
    queryKey: 'filter-voucher-batches-reports',
    queryFn: (currentValues) => {
      const {...filter} = currentValues;
      return getVouchersBatchesReport({...filter});
    },
    components: () => [
      {
        key: 'name',
        type: 'search',
        props: {
          placeholder: 'Name',
          label: 'Search',
          wrapperClass: 'sm:col-span-3',
          disabled: false,
        },
      },
    ],
  });

  const downloadVouchersBatch = async (voucherName: string, batchId: string) => {
    const csvData = await getVoucherBatches(batchId);
    downloadFile(
      csvData,
      `${voucherName}${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  };

  return (
    <PageContainer heading="Vouchers Batch">
      <div className="my-8 space-y-8">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
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
                <Td>Name</Td>
                <Td>Vouchers Count</Td>
                <Td>Type</Td>
                <Td className="whitespace-nowrap w-72">Start Date</Td>
                <Td className="whitespace-nowrap w-72">Expiry Dat</Td>
                <Td>Top-up Regular Amount</Td>
                <Td>Top-up Bonus Amount</Td>
                <Td>Issued</Td>
                <Td>Redeemed</Td>
                <Td>Linked</Td>
                <Td>Gifted</Td>
                <Td>Expired</Td>
                <Td>Voided</Td>
                <Td>Download</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {resolvedData &&
                resolvedData.items.map((routing, index) => (
                  <Tr
                    key={index}
                    render={(props) => (
                      <Link
                        {...props}
                        to={`vouchers/batches/report/list/${routing.batchId}`}
                        data-testid="voucher-batch-record"
                      />
                    )}>
                    <Td>{routing.name}</Td>
                    <Td>{routing.vouchersCount}</Td>
                    <Td>{routing.redeemType}</Td>
                    <Td className="whitespace-nowrap w-56">
                      {routing.startDate && formatDate(routing.startDate)}
                    </Td>
                    <Td className="whitespace-nowrap w-56">
                      {routing.expiryDate && formatDate(routing.expiryDate)}
                    </Td>
                    <Td>{routing.regularAmount}</Td>
                    <Td>{routing.bonusAmount}</Td>
                    <Td>{routing.issued}</Td>
                    <Td>{routing.redeemed}</Td>
                    <Td>{routing.linked}</Td>
                    <Td>{routing.gifted}</Td>
                    <Td>{routing.expired}</Td>
                    <Td>{routing.voided}</Td>
                    <Td>
                      <Button
                        variant="outline"
                        onClick={() => {
                          downloadVouchersBatch(routing.name, routing.batchId);
                        }}
                        leftIcon={<DownloadIcon />}>
                        DOWNLOAD
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
            {resolvedData && !resolvedData.items.length && (
              <DataTableCaption>
                <div className="py-5">
                  <div className="text-center py-5 text-md">
                    <p className="font-normal">You have no data to be displayed here</p>
                  </div>
                </div>
              </DataTableCaption>
            )}
          </DataTable>
        )}
      </div>
    </PageContainer>
  );
};
