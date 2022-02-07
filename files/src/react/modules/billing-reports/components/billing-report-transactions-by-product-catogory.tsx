import {
  Button,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DownloadIcon,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
} from '@setel/portal-ui';
import {isEqual} from 'lodash';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {downloadFile} from 'src/react/lib/utils';
import {OnDemandReportCategory} from 'src/react/services/api-reports.enum';
import {MerchantTypeCodes} from 'src/shared/enums/merchant.enum';
import {billingStatementSummaryRoles} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {useGetMerchantsFilterBy} from '../../cards/card.queries';
import {optBillingFleetPlanFilter, optBillingSalesRegionFilter} from '../billing-reports.constants';
import {useDownloadReportCsv} from '../billing-reports.queries';
import {getReportDataCustom} from '../billing-reports.services';
import {DEMAND_REPORT_BILLING_URLS} from '../billing-reports.types';
import TableReportDataCommon from './table-report-data-common';

const listColumnsNumber = [
  'Purchase amount (RM)',
  'Permanent credit limit (RM)',
  'Subsidy quota (L)',
];
const listColumnsNumber3decimal = ['Purchased quantity'];
const listColumnsDate = ['Statement date'];
const listColumnsPhoneNumber = ['Contact no. (Tel)', 'Contact no. (H/P)'];

interface FilterValue {
  range: [string, string];
  merchantId: string;
  fleetplan: string;
  salesregion: string;
}

const computeFilterValues = ({
  range: [dateFrom, dateTo],
  merchantId,
  ...filter
}: FilterValue & {page: number; perPage: number}) => {
  return {
    ...filter,
    merchantId,
    date_range_start: formatDate(dateFrom, {format: 'yyyy-MM-dd'}),
    date_range_end: formatDate(dateTo, {format: 'yyyy-MM-dd'}) || moment().format('yyyy-MM-dd'),
    category: OnDemandReportCategory.INVOICING,
    url: DEMAND_REPORT_BILLING_URLS.BILLING_TRANSACTIONS_BY_PRODUCT_CATEGORY,
  };
};

export const BillingReportTransactionsByProductCatogory = () => {
  const [searchMerchantName, setSearchMerchantName] = React.useState('');
  const {data: merchantList} = useGetMerchantsFilterBy({
    name: searchMerchantName,
    merchantTypes: [MerchantTypeCodes.SMART_PAY_ACCOUNT],
  });
  const [isErrorDateRange, setIsErrorDateRange] = useState(false);

  const initialFilter: FilterValue = {
    range: ['', ''],
    merchantId: '',
    fleetplan: '',
    salesregion: '',
  };

  const {
    query: {data: resolvedData, isFetching},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'billing_report_transactions',
    queryFn: (currentValues) => getReportDataCustom(computeFilterValues(currentValues)),
    components: (values) => [
      {
        key: 'range',
        type: 'daterange',
        props: {
          label: 'Date range',
          dayOnly: true,
          disableFuture: true,
          // minDate: moment().subtract(6, 'month').toDate(),
          maxDate: moment().toDate(),
          placeholder: 'All date',
          status: isErrorDateRange ? 'error' : ('' as any),
          helpText: isErrorDateRange && 'Allowed date range must not be more than 6 months',
          wrapperClass: 'flex-1',
        },
      },
      {
        key: 'merchantId',
        type: 'searchableselect',
        props: {
          options: (merchantList?.items || []).map((merchant) => ({
            value: merchant.merchantId,
            label: merchant.merchantId,
            description: `Merchant ID : ${merchant.name}`,
          })),
          label: 'Merchant ID',
          placeholder: 'Enter merchant id',
          onInputValueChange: setSearchMerchantName,
          disabled: isEqual(values.range, ['', '']) || isErrorDateRange,
          wrapperClass: 'flex-1',
        },
      },
      {
        key: 'fleetplan',
        type: 'select',
        props: {
          label: 'Fleet plan',
          options: optBillingFleetPlanFilter,
          placeholder: 'All plans',
          disabled: isEqual(values.range, ['', '']) || isErrorDateRange,
          wrapperClass: 'flex-1',
        },
      },
      {
        key: 'salesregion',
        type: 'select',
        props: {
          label: 'Sales region',
          options: optBillingSalesRegionFilter,
          placeholder: 'All regions',
          disabled: isEqual(values.range, ['', '']) || isErrorDateRange,
          wrapperClass: 'flex-1',
        },
      },
    ],
  });

  const data = React.useMemo(() => {
    return resolvedData && resolvedData[0];
  }, [resolvedData]);

  const {mutate: downloadCsv, isLoading: isDownloadingCsv} = useDownloadReportCsv();

  const handleDownload = useCallback(() => {
    downloadCsv(
      computeFilterValues({
        ...filter[0]?.values,
        page: pagination.page,
        perPage: pagination.perPage,
      }),
      {
        onSuccess: (csvData) => {
          downloadFile(csvData, `Transactions by product category.csv`);
        },
      },
    );
  }, [filter[0]?.values, pagination.page, pagination.perPage]);

  const disabledDowload = useMemo(() => {
    return isEqual(filter[0]?.values.range, ['', '']);
  }, [filter[0]?.values]);

  useEffect(() => {
    const [range_start, range_end] = filter[0].values.range;
    const start = moment(range_start).endOf('day').format();
    const minStart = moment(range_end).subtract(6, 'month').endOf('day').format();
    const end = moment(range_end).endOf('day').format();

    if (range_start) {
      if (
        (moment(range_end).endOf('month').isSame(end) && moment(start).isBefore(minStart)) ||
        moment(start).isBefore(minStart)
      ) {
        setIsErrorDateRange(true);
      } else {
        setIsErrorDateRange(false);
      }
    } else {
      setIsErrorDateRange(false);
    }
  }, [filter[0]?.values.range]);

  return (
    <HasPermission accessWith={[billingStatementSummaryRoles.view]}>
      <PageContainer
        heading="Transactions by product category"
        action={
          <Button
            disabled={disabledDowload || isErrorDateRange}
            leftIcon={<DownloadIcon />}
            variant="outline"
            onClick={() => handleDownload()}
            isLoading={isDownloadingCsv}>
            DOWNLOAD CSV
          </Button>
        }
        className="space-y-7 mt-4 max-w-6xl">
        <FilterControls filter={filter} className="flex flex-1 flex-row items-start" />
        <Filter labelText="Search results for:" filter={filter} />
        <DataTable
          striped
          responsive
          isFetching={isFetching}
          pagination={
            data &&
            data.paginated && (
              <PaginationNavigation
                total={data.paginated.record_count}
                currentPage={data.paginated.page}
                perPage={data.paginated.page_size}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          {!data?.final_fields && (
            <>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td className="min-w-60">STATEMENT DATE</Td>
                  <Td className="min-w-60">FLEET PLAN</Td>
                  <Td className="min-w-60">FLEET PLAN</Td>
                  <Td className="min-w-60">SMARTPAY ACCOUNT ID</Td>
                  <Td className="min-w-60">SMARTPAY ACCOUNT NAME</Td>
                  <Td className="min-w-60">CONTACT PERSON</Td>
                  <Td className="min-w-60">CONTACT NO. (TEL)</Td>
                  <Td className="min-w-60">CONTACT NO. (H/P)</Td>
                  <Td className="min-w-60">EMAIL</Td>
                  <Td className="min-w-60">FAX</Td>
                  <Td className="min-w-60">ADDRESS 1</Td>
                  <Td className="min-w-60">ADDRESS 2</Td>
                  <Td className="min-w-60">ADDRESS 3</Td>
                  <Td className="min-w-60">ADDRESS 4</Td>
                  <Td className="min-w-60">ADDRESS 5</Td>
                  <Td className="min-w-60">POSTCODE</Td>
                  <Td className="min-w-60">CITY</Td>
                  <Td className="min-w-60">SALES REGION</Td>
                  <Td className="min-w-60">PURCHASE</Td>
                  <Td className="min-w-60">PURCHASE GROUP NAME</Td>
                  <Td className="min-w-60">PURCHASE CODE</Td>
                  <Td className="min-w-60">PURCHASE ITEM</Td>
                  <Td className="min-w-60">PURCHASE AMOUNT (RM)</Td>
                  <Td className="min-w-60">PURCHASED VOLUME (L)</Td>
                  <Td className="min-w-60">PERMANENT CREDIT LIMIT (RM)</Td>
                  <Td className="min-w-60">SUBSIDY QUOTA (L)</Td>
                  <Td className="min-w-60 text-right">SALES PERSON</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup groupType="tbody">
                <DataTableCaption className="py-5">
                  <b className="absolute inset-x-0 py-5 text-center font-normal">
                    You have no data to be displayed here
                  </b>
                  <div className="w-full h-14"></div>
                </DataTableCaption>
              </DataTableRowGroup>
            </>
          )}
          {data && (
            <TableReportDataCommon
              data={data}
              listColumnsDate={listColumnsDate}
              listColumnsNumber={listColumnsNumber}
              listColumnsPhoneNumber={listColumnsPhoneNumber}
              listColumnsNumber3decimal={listColumnsNumber3decimal}
            />
          )}
        </DataTable>
      </PageContainer>
    </HasPermission>
  );
};
