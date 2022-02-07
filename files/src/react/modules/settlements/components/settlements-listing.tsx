import {
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Pagination,
  usePaginationState,
  FilterControls,
  formatMoney,
  titleCase,
  Badge,
  formatDate,
  DataTableCaption,
  useFilter,
  Filter,
  DATE_RANGES,
} from '@setel/portal-ui';
import * as React from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {PageContainer} from '../../../components/page-container';
import {useListSettlements} from '../settlements.queries';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {
  defaultSettingSettlementPage,
  Settlement,
  SETTLEMENT_STATUS_COLOR,
  SETTLEMENT_STATUS_OPTION,
} from '../settlements.type';
import {useGetMerchants} from '../../merchants/merchants.queries';

export const SettlementsListing = () => {
  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  const {page, setPage, perPage, setPerPage, setIsLastPage, isLastPage} = usePaginationState();

  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name: merchantSearchValue});

  const dateOptions = [
    {
      label: 'Any dates',
      value: '',
    },
    {
      label: 'Today',
      value: DATE_RANGES.today,
    },
    {
      label: 'Yesterday',
      value: DATE_RANGES.yesterday,
    },
    {
      label: 'Last 7 days',
      value: DATE_RANGES.last7days,
    },
    {
      label: 'Last 30 days',
      value: DATE_RANGES.last30days,
    },
  ];

  const filter = useFilter(
    {
      status: '',
      dateRange: ['', ''] as [string, string],
      merchantId: '',
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            placeholder: 'All status',
            options: [
              {
                label: 'Any statuses',
                value: '',
              },
              ...SETTLEMENT_STATUS_OPTION,
            ],
          },
        },
        {
          key: 'dateRange',
          type: 'daterange',
          props: {
            label: 'Created',
            options: dateOptions,
          },
        },
        {
          key: 'merchantId',
          type: 'searchableselect',
          props: {
            label: 'Merchant',
            placeholder: 'Search by Merchant ID/Name',
            onInputValueChange: setMerchantSearchValue,
            options: merchants,
            wrapperClass: 'col-span-2',
          },
        },
      ],
      onChange: () => setPage(defaultSettingSettlementPage.defaultPage),
    },
  );
  const [{values}] = filter;

  React.useEffect(() => {
    if (!values.merchantId) {
      setMerchantSearchValue('');
    }
  }, [values.merchantId]);

  const requestFilters = React.useMemo(
    () => ({
      status: values.status,
      createdAtFrom: values.dateRange[0],
      createdAtTo: values.dateRange[1],
      merchantId: values.merchantId || undefined,
      page,
      toLast: isLastPage,
      perPage,
    }),
    [values, page, perPage, isLastPage],
  );

  const {data, isLoading, isError, error} = useListSettlements(requestFilters);

  const getDetailSettlementUrl = (tx: Settlement): string => {
    return `${webDashboardUrl}/payments/settlements?merchantId=${tx.merchantId}&settlementId=${tx.id}&redirect-from=admin`;
  };

  return (
    <div>
      <PageContainer heading="Settlements">
        <div className="mb-8 space-y-8">
          <FilterControls className="lg:grid-cols-4" filter={filter} />
          <Filter filter={filter} labelText="Search results for" />
        </div>

        {isLoading && <p className="sr-only">Loading...</p>}
        {isError && <QueryErrorAlert error={error as any} />}
        <Table
          isLoading={isLoading}
          pagination={
            data && (
              <Pagination
                currentPage={data.metadata.currentPage}
                pageSize={perPage}
                onChangePageSize={setPerPage}
                onChangePage={setPage}
                lastPage={data.metadata.lastPage}
                hideIfSinglePage
                onGoToLast={() => {
                  setIsLastPage(true);
                }}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="w-1/5 text-right">Amount (RM)</Td>
              <Td className="w-1/5">Status</Td>
              <Td className="w-1/5">Transactions</Td>
              <Td className="w-1/5">Merchant name</Td>
              <Td className="w-1/5 text-right">Created on</Td>
            </Tr>
          </DataTableRowGroup>

          {isLoading ? (
            <DataTableRowGroup></DataTableRowGroup>
          ) : data?.settlements?.length > 0 ? (
            <DataTableRowGroup>
              {data.settlements.map((settlement) => (
                <Tr
                  render={(props) => (
                    <a target="_blank" href={getDetailSettlementUrl(settlement)} {...props} />
                  )}
                  key={settlement.id}>
                  <Td className="text-right w-40">{formatMoney(settlement.amount, '')}</Td>
                  <Td>
                    {settlement.status && (
                      <Badge
                        rounded="rounded"
                        className="uppercase"
                        color={SETTLEMENT_STATUS_COLOR[settlement.status]}>
                        {titleCase(settlement.status, {
                          hasUnderscore: true,
                        }).toUpperCase()}
                      </Badge>
                    )}
                  </Td>
                  <Td>{settlement.totalTransactions}</Td>
                  {settlement.merchantId && (
                    <Td>{settlement.merchantName || `ID: ${settlement.merchantId}`}</Td>
                  )}
                  <Td className="text-right">
                    {settlement?.createdAt ? formatDate(settlement.createdAt) : ''}
                  </Td>
                </Tr>
              ))}
            </DataTableRowGroup>
          ) : (
            <DataTableCaption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No settlement was found</p>
              </div>
            </DataTableCaption>
          )}
        </Table>
      </PageContainer>
    </div>
  );
};
