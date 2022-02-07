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
  PlusIcon,
  formatMoney,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  EStatusTextPair,
  ETransactionTypeTextPair,
  optTransactionTypeFilter,
  optTransactionFleetFilterBy,
  ETransaction_Type,
  ETRANSACTION_STATUS,
  ETransactionFleet_Filter_By,
  optTransactionTerminalFleetFilterBy,
  LESS_FLEETFILTERS,
  ETransaction_Filter_By,
  optStatusFleetFilter,
} from '../emum';

import {TransactionSendEmailModal} from './transaction-send-email-modal';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getFleetTransactions} from '../transaction.service';
import {
  useGetCards,
  useGetMerchantsFilterBy,
  useGetVehiclePlateNumberQuery,
} from '../../cards/card.queries';
import {Link} from 'src/react/routing/link';
import {colorByStatus} from './transaction-details';
import {HasPermission} from '../../auth/HasPermission';
import {cardTransactionRole} from 'src/shared/helpers/roles.type';
import {FilterBy, FleetPlan} from '../../cards/card.type';
import {TransactionManualMerchantModal} from './transaction-manual-merchant-modal';
import {useTerminals} from '../../terminals/terminals.queries';
import {useSetelTerminals} from '../../setel-terminals/setel-terminals.queries';
import {useQueryParams} from 'src/react/routing/routing.context';

interface FilterValue {
  type: ETransaction_Type;
  status: ETRANSACTION_STATUS;
  dateRange: [string, string];
  stationMerchantId: string;
  merchantId: string;
  cardNumber: string;
  level: ETransactionFleet_Filter_By;
  source: ETransactionFleet_Filter_By;
  terminalIdSearchText: string;
  rrnSearchText: string;
  batchIdSearchText: string;
  requestId: string;
  referenceIdSearchText: string;
  vehicleNumber: string;
  terminalId: string;
}

const initialFilter: FilterValue = {
  stationMerchantId: '',
  merchantId: '',
  cardNumber: '',
  level: null,
  source: null,
  terminalIdSearchText: '',
  rrnSearchText: '',
  batchIdSearchText: '',
  referenceIdSearchText: '',
  terminalId: '',
  vehicleNumber: '',
  status: null,
  type: null,
  dateRange: ['', ''],
  requestId: '',
};

const computeEmailFilterValues = ({
  dateRange: [dateFrom, dateTo],
  level,
  terminalIdSearchText,
  rrnSearchText,
  batchIdSearchText,
  ...filter
}: any & {page: number; perPage: number}) => {
  const values = (
    level === ETransaction_Filter_By.BATCHID ? [batchIdSearchText] : [rrnSearchText]
  ).filter(Boolean);

  return {
    ...filter,
    level,
    values: values.length > 0 ? values : undefined,
    dateFrom,
    dateTo,
  };
};

const computeFilterValues = ({
  dateRange: [dateFrom, dateTo],
  level,
  terminalIdSearchText,
  referenceIdSearchText,
  batchIdSearchText,
  ...filter
}: FilterValue & {page: number; perPage: number}) => {
  const rrn = level === ETransactionFleet_Filter_By.REFERENCE_NUMBER ? referenceIdSearchText : '';
  const batchId = level === ETransactionFleet_Filter_By.BATCHNUMBER ? batchIdSearchText : '';
  return {
    ...filter,
    rrn: rrn.length > 0 ? rrn : undefined,
    settlementBatchId: batchId.length > 0 ? batchId : undefined,
    dateFrom,
    dateTo,
  };
};
export const TransactionFleetList = () => {
  const queryParams = useQueryParams();
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [sendEmailModal, setSendEmailModal] = React.useState(false);
  const [isShowAll, setShowAll] = React.useState(false);
  const [merchantSearchText, setMerchantSearchText] = React.useState('');
  const [smartPayAccountSearchText, setSmartPayAccountSearchText] = React.useState('');
  const [cardNumberSearchText, setCardNumberSearchText] = React.useState('');
  const [cardPlateNumberSearchText, setCardPlateNumberSearchText] = React.useState('');
  const [terminalSearchText, setTerminalSearchText] = React.useState('');
  const [setelTerminalSearchText, setSetelTerminalSearchText] = React.useState('');
  const {data: merchantList} = useGetMerchantsFilterBy({
    name: merchantSearchText,
    merchantTypes: ['stationDealer'],
  });
  const {data: vehiclePlateNumberList} = useGetVehiclePlateNumberQuery({
    vehicleNumbers: [cardPlateNumberSearchText],
  });
  const {data: smartPayAccountList} = useGetMerchantsFilterBy({
    name: smartPayAccountSearchText,
    merchantTypes: ['smartPayAccount'],
  });
  const {data: terminals} = useTerminals({
    enabled: true,
    merchantId: queryParams.params.stationMerchantId,
    terminalId: terminalSearchText,
  });
  const {data: setelTerminals} = useSetelTerminals({
    merchantId: queryParams.params.stationMerchantId,
    terminalId: setelTerminalSearchText,
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
    queryFn: (currentValues) => getFleetTransactions(computeFilterValues(currentValues)),
    components: ({level, source}) =>
      (
        [
          {
            type: 'select',
            key: 'status',
            props: {
              label: 'Status',
              options: optStatusFleetFilter,
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
              wrapperClass: 'lg:col-span-1',
            },
          },
          {
            type: 'searchableselect',
            key: 'merchantId',
            props: {
              label: 'Smartpay account',
              placeholder: 'Enter smartpay account',
              onInputValueChange: setSmartPayAccountSearchText,
              wrapperClass: 'col-start-1',
              options:
                smartPayAccountList &&
                smartPayAccountList.items.map((merchant) => ({
                  value: merchant.merchantId,
                  description: `Merchant ID: ${merchant.merchantId}`,
                  label: merchant.name,
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
            type: 'searchableselect',
            key: 'vehicleNumber',
            props: {
              label: 'Vehicle plate number',
              placeholder: 'Enter vehicle plate number',
              onInputValueChange: setCardPlateNumberSearchText,
              options: vehiclePlateNumberList,
            },
          },
          {
            type: 'searchableselect',
            key: 'stationMerchantId',
            props: {
              label: 'Merchant',
              placeholder: 'Enter merchant name',
              onInputValueChange: setMerchantSearchText,
              options:
                merchantList &&
                merchantList.items.map((merchant) => ({
                  value: merchant.merchantId,
                  description: `Merchant ID: ${merchant.merchantId}`,
                  label: merchant.name,
                })),
            },
          },

          {
            type: 'select',
            key: 'level',
            props: {
              label: 'Search by',
              options: optTransactionFleetFilterBy,
              placeholder: 'Please select',
            },
          },
          level === ETransactionFleet_Filter_By.BATCHNUMBER
            ? {
                type: 'search',
                key: 'batchIdSearchText',
                props: {
                  placeholder: level ? 'Enter batch number' : 'Please select search by first',
                  disabled: !level,
                },
              }
            : {
                type: 'search',
                key: 'referenceIdSearchText',
                props: {
                  placeholder: level ? 'Enter reference number' : 'Please select search by first',
                  disabled: !level,
                },
              },
          {
            type: 'select',
            key: 'source',
            props: {
              label: 'Source',
              options: optTransactionTerminalFleetFilterBy,
              placeholder: 'Please select',
            },
          },
          source === ETransactionFleet_Filter_By.INVENCO
            ? {
                type: 'searchableselect',
                key: 'terminalId',
                props: {
                  placeholder: source ? 'Enter Invenco terminal' : 'Please select search by first',
                  onInputValueChange: setTerminalSearchText,
                  options:
                    terminals &&
                    terminals.terminals.map((terminal) => ({
                      value: terminal.terminalId,
                      label: terminal.terminalId,
                    })),
                },
              }
            : source === ETransactionFleet_Filter_By.SETEL
            ? {
                type: 'searchableselect',
                key: 'terminalId',
                props: {
                  placeholder: source ? 'Enter Setel terminal' : 'Please select search by first',
                  onInputValueChange: setSetelTerminalSearchText,
                  options:
                    setelTerminals &&
                    setelTerminals.terminals.map((terminal) => ({
                      value: terminal.terminalId,
                      label: terminal.terminalId,
                    })),
                },
              }
            : source === ETransactionFleet_Filter_By.CARDLESS
            ? {
                type: 'searchableselect',
                key: 'terminalId',
                props: {
                  placeholder: source ? 'Enter SmartPay terminal' : 'Please select search by first',
                  onInputValueChange: setTerminalSearchText,
                  options:
                    terminals &&
                    terminals.terminals.map((terminal) => ({
                      value: terminal.terminalId,
                      label: terminal.terminalId,
                    })),
                },
              }
            : source === ETransactionFleet_Filter_By.ROVR
            ? {
                type: 'searchableselect',
                key: 'terminalId',
                props: {
                  placeholder: source ? 'Enter ROVR terminal' : 'Please select search by first',
                  onInputValueChange: setSetelTerminalSearchText,
                  options:
                    setelTerminals &&
                    setelTerminals.terminals.map((terminal) => ({
                      value: terminal.terminalId,
                      label: terminal.terminalId,
                    })),
                },
              }
            : {
                type: 'searchableselect',
                key: 'terminalId',
                props: {
                  placeholder: 'Enter terminal',
                  onInputValueChange: setTerminalSearchText,
                  options:
                    terminals &&
                    terminals.terminals.map((terminal) => ({
                      value: terminal.terminalId,
                      label: terminal.terminalId,
                    })),
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
              | 'vehicleNumber'
              | 'level'
              | 'source'
              | 'stationMerchantId'
              | 'rrnSearchText'
              | 'terminalId'
              | 'merchantId'
            >
          >
        >
      ).filter((field) => (isShowAll ? LESS_FLEETFILTERS.includes(field.key) : true)),
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
              <HasPermission accessWith={[cardTransactionRole.view]}>
                <Button
                  variant="primary"
                  leftIcon={<PlusIcon />}
                  className="align-bottom ml-3"
                  onClick={() => {
                    setVisibleModal(true);
                  }}>
                  CREATE
                </Button>
              </HasPermission>
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
                      to={`/card-issuing/card-transactions-fleet/${transaction.transactionUid}`}
                    />
                  )}
                  key={transaction.id}>
                  <Td className="break-all w-40 text-right">
                    {formatMoney(transaction?.amount || '0.00')}
                  </Td>
                  <Td className="pb-1 pt-1">
                    {transaction?.cardNumber && (
                      <div className="float-left w-11 h-6 mr-4">
                        <img
                          className="w-11 h-8 relative -top-1.5"
                          src={`assets/images/logo-card/card-${
                            transaction?.fleetPlan
                              ? transaction?.fleetPlan === FleetPlan.POSTPAID
                                ? FleetPlan.POSTPAID
                                : FleetPlan.PREPAID
                              : 'fleet'
                          }.png`}
                        />
                      </div>
                    )}
                    {transaction.cardNumber}
                  </Td>
                  <Td className="break-all">
                    <Badge
                      color={colorByStatus[transaction.status]}
                      rounded="rounded"
                      className="uppercase">
                      {EStatusTextPair[transaction.status]}
                    </Badge>
                  </Td>
                  <Td className="break-all">{ETransactionTypeTextPair[transaction.type]}</Td>
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
          filters={computeEmailFilterValues({
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
          terminal={undefined}
          merchant={undefined}
          // adminUser={adminUser}
        />
      )}
    </>
  );
};
