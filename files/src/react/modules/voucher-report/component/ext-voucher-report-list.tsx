import {
  Button,
  Filter,
  FilterControls,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Alert,
  PaginationNavigation,
  formatDate,
  Badge,
  DownloadIcon,
  DataTableCaption,
} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {downloadFile} from 'src/react/lib/utils';
import {getExtVouchersReport, getExtVouchersReportCSV} from '../voucher.service';

export const ExtVoucherReportList = () => {
  const {
    query: {data: resolvedData, isError, isLoading},
    pagination,
    filter,
  } = useDataTableState({
    queryKey: 'e-pay-recon-report',
    queryFn: (currentValues) => {
      const {
        dateRange: [startDate, endDate],
        ...filter
      } = currentValues;
      return getExtVouchersReport({...filter, startDate, endDate});
    },
    initialFilter: {
      match: '',
      dateRange: ['', ''] as [string, string],
    },
    components: [
      {
        key: 'match',
        type: 'select',
        props: {
          label: 'Match',
          options: MATCH_OPTIONS,
          placeholder: 'All statuses',
        },
      },
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'Date',
        },
      },
    ],
  });

  const downloadCsv = async () => {
    const [{values: filterValues}] = filter;
    const {page, perPage} = pagination;
    const {
      dateRange: [startDate, endDate],
      match,
    } = filterValues;

    const csvData = await getExtVouchersReportCSV({
      perPage,
      page,
      match,
      startDate,
      endDate,
    });

    downloadFile(
      csvData,
      `ext_vouchers_report-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  };

  return (
    <PageContainer
      heading="Devices"
      action={
        <Button
          disabled={resolvedData && resolvedData.isEmpty}
          onClick={downloadCsv}
          leftIcon={<DownloadIcon />}
          variant="outline">
          DOWNLOAD CSV
        </Button>
      }>
      <div className="space-y-5">
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
                <Td>File name</Td>
                <Td>Date</Td>
                <Td>Title</Td>
                <Td>Serial number</Td>
                <Td>Voucher Code</Td>
                <Td>Value (RM)</Td>
                <Td>Terminal Id</Td>
                <Td>Retailer Name</Td>
                <Td>Match</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {resolvedData &&
                resolvedData.items.map((extVoucher, index) => (
                  <Tr key={index}>
                    <Td>{extVoucher.docName}</Td>
                    <Td className="whitespace-nowrap">
                      {formatDate(extVoucher.records.date, {
                        formatType: 'dateAndTime',
                      })}
                    </Td>
                    <Td>{extVoucher.records.title}</Td>
                    <Td>{extVoucher.records.voucherSerialNumber}</Td>
                    <Td>{extVoucher.records.voucherCode && extVoucher.records.voucherCode}</Td>
                    <Td>{extVoucher.records.value && extVoucher.records.value}</Td>
                    <Td>{extVoucher.records.terminalId}</Td>
                    <Td className="whitespace-nowrap">{extVoucher.records.retailerName}</Td>
                    <Td>
                      {extVoucher.records.match ? (
                        <Badge color="success" className="uppercase">
                          Yes
                        </Badge>
                      ) : (
                        <Badge color="error" className="uppercase">
                          No
                        </Badge>
                      )}
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

const MATCH_OPTIONS = [
  {
    label: 'None',
    value: '',
  },
  {
    label: 'Yes',
    value: 'true',
  },
  {
    label: 'No',
    value: 'false',
  },
];
