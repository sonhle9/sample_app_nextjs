import {
  classes,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  DownloadIcon,
  Badge,
  formatDate,
  Filter,
  FilterControls,
  DataTableCaption,
  BareButton,
  FilterControlConfig,
  Button,
  Tabs,
  Card,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  EStatusTextPair,
  ETransactionTypeTextPair,
  optStatusFilter,
  optTransactionTypeFilter,
  optTransactionFilterBy,
  ETransaction_Filter_By,
  ETransaction_Type,
  ETRANSACTION_STATUS,
  LESS_FILTERS,
  EStatus,
} from '../emum';

import {TransactionSendEmailModal} from './transaction-send-email-modal';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {useHasPermission} from 'src/react/modules/auth/HasPermission';
import {getTransactions} from '../transaction.service';
import {useGetCards, useGetMerchantsFilterBy} from '../../cards/card.queries';
import {Link} from 'src/react/routing/link';
import {colorByStatus} from './transaction-details';
import {HasPermission} from '../../auth/HasPermission';
import {cardTransactionRole} from 'src/shared/helpers/roles.type';
import {FilterBy} from '../../cards/card.type';
import {TransactionManualMerchantModal} from './transaction-manual-merchant-modal';
import {useQueryParams, useSetQueryParams} from 'src/react/routing/routing.context';
import {TransactionFleetList} from './fleet-transaction-list';

interface FilterValue {
  type: ETransaction_Type;
  status: ETRANSACTION_STATUS;
  dateRange: [string, string];
  merchantId: string;
  cardNumber: string;
  level: ETransaction_Filter_By;
  terminalIdSearchText: string;
  rrnSearchText: string;
  batchIdSearchText: string;
  requestId: string;
}

const initialFilter: FilterValue = {
  merchantId: '',
  cardNumber: '',
  level: null,
  terminalIdSearchText: '',
  rrnSearchText: '',
  batchIdSearchText: '',
  status: null,
  type: null,
  dateRange: ['', ''],
  requestId: '',
};

const computeFilterValues = ({
  dateRange: [dateFrom, dateTo],
  level,
  terminalIdSearchText,
  rrnSearchText,
  batchIdSearchText,
  ...filter
}: FilterValue & {page: number; perPage: number}) => {
  const values = (
    level === ETransaction_Filter_By.RRN
      ? [rrnSearchText]
      : level === ETransaction_Filter_By.BATCHID
      ? [batchIdSearchText]
      : [terminalIdSearchText]
  ).filter(Boolean);

  return {
    ...filter,
    level,
    values: values.length > 0 ? values : undefined,
    dateFrom,
    dateTo,
  };
};
export const TransactionListing = () => {
  const activated = useQueryParams();
  const getQueryParams = useQueryParams();
  const setQueryParams = useSetQueryParams();
  const [tabSelected, setTabSelected] = React.useState<number>(
    Number(getQueryParams.params?.tab) || 0,
  );

  const handleChangeTab = React.useCallback(
    (tabIndex: number) => {
      if (tabSelected === tabIndex) return;
      setTabSelected(tabIndex);
      setQueryParams({tab: tabIndex}, {merge: false});
    },
    [tabSelected],
  );
  React.useEffect(() => {
    const active = Number(getQueryParams.params?.tab) === tabSelected;
    setQueryParams({tab: tabSelected}, {merge: active});
  }, [tabSelected, getQueryParams.params]);
  return activated ? (
    <HasPermission accessWith={[cardTransactionRole.view]}>
      <Tabs index={tabSelected} onChange={handleChangeTab}>
        <Card
          style={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}>
          <Tabs.TabList>
            <Tabs.Tab label="Gift" />
            {useHasPermission([cardTransactionRole.fleet_tab_view]) && <Tabs.Tab label="Fleet" />}
          </Tabs.TabList>
        </Card>
        <Tabs.Panels>
          <Tabs.Panel>
            <TransactionList />
          </Tabs.Panel>
          <HasPermission accessWith={[cardTransactionRole.fleet_tab_view]}>
            <Tabs.Panel>
              <TransactionFleetList />
            </Tabs.Panel>
          </HasPermission>
        </Tabs.Panels>
      </Tabs>
    </HasPermission>
  ) : null;
};
export const TransactionList = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [sendEmailModal, setSendEmailModal] = React.useState(false);
  const [isShowAll, setShowAll] = React.useState(false);
  const [merchantSearchText, setMerchantSearchText] = React.useState('');
  const [cardNumberSearchText, setCardNumberSearchText] = React.useState('');
  const {data: merchantList} = useGetMerchantsFilterBy({
    name: merchantSearchText,
    ...(Number(merchantSearchText) &&
      ((merchantSearchText.length < 15 && {merchantTypes: ['giftCardClient', 'smartPayAccount']}) ||
        (merchantSearchText.length === 15 && {merchantTypes: ['stationDealer']}))),
  });
  const {data: cardNumberList} = useGetCards({
    filterBy: FilterBy.cardNumber,
    ...(cardNumberSearchText && {values: [cardNumberSearchText]}),
  });
  const {
    query: {data: data, isFetching},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'transactions',
    queryFn: (currentValues) => getTransactions(computeFilterValues(currentValues)),
    components: ({level}) =>
      (
        [
          {
            type: 'select',
            key: 'status',
            props: {
              label: 'Status',
              options: optStatusFilter,
              placeholder: 'All statuses',
            },
          },
          {
            type: 'select',
            key: 'type',
            props: {
              label: 'Transaction type',
              options: optTransactionTypeFilter,
              placeholder: 'All types',
              wrapperClass: 'lg:col-span-1',
            },
          },
          {
            type: 'daterange',
            key: 'dateRange',
            props: {
              label: 'Transaction on',
              wrapperClass: 'lg:col-span-2 xl:col-span-2',
            },
          },
          {
            type: 'searchableselect',
            key: 'merchantId',
            props: {
              label: 'Merchant',
              wrapperClass: 'lg:col-span-2 xl:col-span-2',
              placeholder: 'Enter merchant name',
              onInputValueChange: setMerchantSearchText,
              options:
                merchantList &&
                merchantList.items.map((merchant) => ({
                  value: merchant.merchantId,
                  description: `Merchant ID: ${merchant.merchantId}`,
                  label: merchant.name + `${merchant?.legalName && ` ${merchant.legalName}`}`,
                })),
            },
          },
          {
            type: 'searchableselect',
            key: 'cardNumber',
            props: {
              label: 'Card number',
              placeholder: 'Enter card number',
              onInputValueChange: setCardNumberSearchText,
              options:
                cardNumberList &&
                cardNumberList.items.map((card) => ({
                  value: card.cardNumber,
                  label: card.cardNumber,
                })),
            },
          },
          {
            type: 'select',
            key: 'level',
            props: {
              label: 'Search by',
              options: optTransactionFilterBy,
              placeholder: 'All',
              className: 'flex-1',
              wrapperClass: 'col-start-1',
            },
          },
          level === ETransaction_Filter_By.RRN
            ? {
                type: 'search',
                key: 'rrnSearchText',
                props: {
                  placeholder: level ? 'Enter keyword...' : 'Please select search by first',
                  disabled: !level,
                  wrapperClass: 'lg:col-span-2',
                },
              }
            : level === ETransaction_Filter_By.BATCHID
            ? {
                type: 'search',
                key: 'batchIdSearchText',
                props: {
                  placeholder: level ? 'Enter keyword...' : 'Please select search by first',
                  disabled: !level,
                  wrapperClass: 'lg:col-span-2',
                },
              }
            : {
                type: 'search',
                key: 'terminalIdSearchText',
                props: {
                  placeholder: level ? 'Enter keyword...' : 'Please select search by first',
                  disabled: !level,
                  wrapperClass: 'lg:col-span-2',
                },
              },
        ] as Array<
          FilterControlConfig<
            keyof Pick<
              FilterValue,
              | 'dateRange'
              | 'status'
              | 'type'
              | 'batchIdSearchText'
              | 'cardNumber'
              | 'level'
              | 'merchantId'
              | 'rrnSearchText'
              | 'terminalIdSearchText'
            >
          >
        >
      ).filter((field) => (isShowAll ? LESS_FILTERS.includes(field.key) : true)),
    propExcludedFromApplied: ['level'],
  });
  const [{values: filterValues}] = filter;

  return (
    <>
      <HasPermission accessWith={[cardTransactionRole.view]}>
        <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
            <h1 className={classes.h1}>Card transactions</h1>
            <div>
              <Button
                variant="outline"
                leftIcon={<DownloadIcon />}
                onClick={() => setSendEmailModal(true)}>
                DOWNLOAD CSV
              </Button>
            </div>
          </div>
          <HasPermission accessWith={[cardTransactionRole.search]}>
            <FilterControls
              filter={filter}
              className={filter[0].applied.length ? 'grid grid-cols-4' : 'grid grid-cols-4 mb-4'}>
              <div className="col-start-1">
                <BareButton className="text-brand-500" onClick={() => setShowAll(!isShowAll)}>
                  {isShowAll ? 'MORE FILTERS' : 'LESS FILTERS'}
                </BareButton>
              </div>
            </FilterControls>
            <Filter filter={filter} />
          </HasPermission>
          <DataTable
            striped
            pagination={
              <PaginationNavigation
                total={data && data.totalDocs}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            }
            isFetching={isFetching}>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td className="w-40 text-right">Amount (RM)</Td>
                <Td>Card number</Td>
                <Td>Status</Td>
                <Td>Transaction Type</Td>
                <Td className="text-right">Transaction on</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup groupType="tbody">
              {(data?.transactions || []).map((transaction) => (
                <Tr
                  render={(props) => (
                    <Link
                      {...props}
                      to={`/card-issuing/card-transactions/${transaction.transactionUid}`}
                    />
                  )}
                  key={transaction.id}>
                  <Td className="break-all w-40 text-right">
                    {(transaction.amount && transaction.multiplier === 'dr' ? '-' : '') +
                      convertToSensitiveNumber(transaction.amount)}
                  </Td>
                  <Td className="pb-1 pt-1">
                    {transaction?.cardNumber && (
                      <div className="float-left w-11 h-6 mr-4">
                        <img
                          className="w-11 h-8 relative -top-1.5"
                          src={`assets/images/logo-card/card-gift.png`}
                        />
                      </div>
                    )}
                    {transaction.cardNumber}
                  </Td>
                  <Td className="break-all">
                    <Badge
                      color={
                        transaction.status === EStatus.REFUNDED
                          ? colorByStatus[EStatus.VOIDED]
                          : colorByStatus[transaction.status]
                      }
                      rounded="rounded"
                      className="uppercase">
                      {transaction.status === EStatus.REFUNDED
                        ? EStatusTextPair[EStatus.VOIDED]
                        : EStatusTextPair[transaction.status]}
                    </Badge>
                  </Td>
                  <Td className="break-all">
                    {ETransactionTypeTextPair[transaction.type]}
                    {ETransactionTypeTextPair[transaction.type] &&
                      transaction?.isoTransactionType &&
                      ' - '}
                    {transaction?.isoTransactionType}
                  </Td>
                  <Td className="text-right">
                    {formatDate(
                      transaction.transactionDate
                        ? transaction.transactionDate
                        : transaction.createdAt,
                      {
                        format: 'dd MMM yyyy, hh:mm:ss.SSS a',
                      },
                    )}
                  </Td>
                </Tr>
              ))}
            </DataTableRowGroup>
            {data && !data?.transactions.length && (
              <DataTableCaption>
                <div className="py-5">
                  <div className="text-center py-5 text-md">
                    <p className="font-normal">You have no data to be displayed here</p>
                  </div>
                </div>
              </DataTableCaption>
            )}
          </DataTable>
        </div>
      </HasPermission>

      {sendEmailModal && (
        <TransactionSendEmailModal
          visible={sendEmailModal}
          onClose={() => {
            setSendEmailModal(false);
          }}
          filters={computeFilterValues({
            ...filterValues,
            page: pagination.page,
            perPage: pagination.perPage,
          })}
        />
      )}

      {visibleModal && (
        <TransactionManualMerchantModal
          visible={visibleModal}
          onClose={() => setVisibleModal(false)}
          merchant={undefined}
          terminal={''}
          // adminUser={adminUser}
        />
      )}
    </>
  );
};
