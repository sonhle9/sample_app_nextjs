import {
  Alert,
  Badge,
  BadgeProps,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  Filter,
  FilterControls,
  formatDate,
  Notification,
  PaginationNavigation,
  useFilter,
  usePaginationState,
  useTransientState,
} from '@setel/portal-ui';
import * as React from 'react';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {useMountSafe} from 'src/react/hooks/use-mount-safe';
import {Link} from 'src/react/routing/link';
import {
  PaymentIconMapping,
  TerminalSwitchTransactionStatusMapColor,
  TerminalSwitchTransactionStatusOption,
  TerminalSwitchTransactionTypeOptions,
  TerminalSwitchTransactionTypeTextMapping,
} from '../constant';
import {useSwitchTransaction} from '../terminal-switch-transaction.query';
import {
  downloadTerminalSwitchTransactionCsv,
  sentTerminalSwitchTransactionViaEmail,
  useGetMerchants,
} from '../terminal-switch-transaction.service';
import {
  ITerminalSwitchTransactionResponseDto,
  TerminalSwitchTransactionStatus,
  TerminalSwitchTransactionType,
} from '../terminal-switch-transaction.type';

export const TerminalSwitchTransactionListing = () => {
  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name: merchantSearchValue});

  //notification
  const [showNoti, setShowNoti] = useTransientState(false);
  const setShowNotiSafe = useMountSafe(setShowNoti);
  const [notiType, setNotiType] = React.useState<'success' | 'error' | undefined>(undefined);
  const setNotiTypeSafe = useMountSafe(setNotiType);

  const [batchNum, setBatchNum] = React.useState('');
  const [terminalId, setTerminalId] = React.useState('');

  const filter = useFilter(
    {
      transactionType: '',
      status: '',
      dateRange: ['', ''] as [string, string],
      merchantId: '',
      batchNum: '',
      terminalId: '',
    },
    {
      components: [
        {
          key: 'transactionType',
          type: 'select',
          props: {
            'data-testid': 'type-filter-box',
            defaultChecked: true,
            label: ' Transaction type',
            placeholder: 'All types',
            options: TerminalSwitchTransactionTypeOptions,
          },
        },
        {
          key: 'status',
          type: 'select',
          props: {
            'data-testid': 'status-filter-box',
            label: 'Status',
            placeholder: 'All status',
            options: TerminalSwitchTransactionStatusOption,
          },
        },
        {
          key: 'dateRange',
          type: 'daterange',
          props: {
            label: 'Created on',
          },
        },
        {
          key: 'batchNum',
          type: 'searchableselect',
          props: {
            'data-testid': 'batchNum-filter-box',
            wrapperClass: 'col-span-2',
            label: 'Batch',
            placeholder: 'Search by Batch ID',
            onInputValueChange: setBatchNum,
            options: batchNum
              ? [
                  {
                    value: batchNum,
                    label: batchNum,
                  },
                ]
              : [],
          },
        },
        {
          key: 'terminalId',
          type: 'searchableselect',
          props: {
            'data-testid': 'terminalId-filter-box',
            itemScope: false,
            wrapperClass: 'col-span-2',
            label: 'Terminal',
            placeholder: 'Search by Terminal ID',
            onInputValueChange: setTerminalId,
            options: terminalId
              ? [
                  {
                    value: terminalId,
                    label: terminalId,
                  },
                ]
              : [],
          },
        },
        {
          key: 'merchantId',
          type: 'searchableselect',
          props: {
            'data-testid': 'merchantId-filter-box',
            wrapperClass: 'col-span-2',
            label: 'Merchant',
            placeholder: 'Search by Merchant ID or Name',
            onInputValueChange: setMerchantSearchValue,
            options: merchants,
          },
        },
      ],
      onChange: () => setPage(1),
    },
  );

  const [{values}] = filter;

  React.useEffect(() => {
    if (!values.merchantId) {
      setMerchantSearchValue('');
    }
  }, [values.merchantId]);

  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: 20,
  });

  const requestFilter = React.useMemo(
    () => ({
      status: values.status as TerminalSwitchTransactionStatus,
      type: values.transactionType as TerminalSwitchTransactionType,
      merchantId: values.merchantId || undefined,
      batchNum: values.batchNum,
      terminalId: values.terminalId,
      page,
      from: values.dateRange[0],
      to: values.dateRange[1],
      perPage,
    }),
    [values, page, perPage],
  );

  const {data, isFetching, isError} = useSwitchTransaction(requestFilter);

  const mapTransactionToRow = (
    transaction: ITerminalSwitchTransactionResponseDto,
    index: number,
  ) => {
    {
      const {status, card, amount, createdAt: rawCreatedAT, type} = transaction;
      const createdAt =
        rawCreatedAT &&
        formatDate(rawCreatedAT, {
          formatType: 'dateAndTime',
        });
      let displayedPan = card?.maskedPan;
      const brand = card?.brand;
      const brandLogoUrl = PaymentIconMapping[brand];
      const statusColor = TerminalSwitchTransactionStatusMapColor[status] as BadgeProps['color'];
      const prettyType = TerminalSwitchTransactionTypeTextMapping[type];
      return (
        <DataTableRow
          key={index}
          render={(props) => (
            <Link
              data-testid="terminal-switch-transaction-row"
              to={`gateway/transactions/${transaction.id}`}
              {...props}
            />
          )}>
          <DataTableCell className="w-1/6 align-middle">{prettyType}</DataTableCell>
          <DataTableCell className="w-1/4 align-middle content-center">
            <div className="h-8 flex">
              <img src={brandLogoUrl} className="h-8" />
              <div className="p-2 bd-highlight">{displayedPan}</div>
            </div>
          </DataTableCell>
          <DataTableCell className="align-middle">
            <Badge
              className="tracking-wider font-semibold"
              rounded="rounded"
              color={statusColor}
              size="large">
              {status}
            </Badge>
          </DataTableCell>
          <DataTableCell className="text-right align-middle">{amount}</DataTableCell>
          <DataTableCell className="text-right align-middle">{createdAt}</DataTableCell>
        </DataTableRow>
      );
    }
  };
  const isEmptySwitchTransactionList =
    data && data.switchTransactions && data.switchTransactions.length === 0;
  React.useEffect(() => {
    if (!values.merchantId) {
      setMerchantSearchValue('');
    }
  }, [values.merchantId]);

  const downloadCsv = React.useCallback(() => {
    const {page, perPage, ...rest} = requestFilter;
    return downloadTerminalSwitchTransactionCsv(rest);
  }, [requestFilter]);
  const sendEmailCsv = React.useCallback(
    async (email: string[]) => {
      const {page, perPage, ...rest} = requestFilter;
      await sentTerminalSwitchTransactionViaEmail(email, rest)
        .then(() => {
          setShowNotiSafe(true);
          setNotiTypeSafe('success');
        })
        .catch(() => {
          setShowNotiSafe(true);
          setNotiTypeSafe('error');
        });
    },
    [requestFilter],
  );

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between">
          <div className="self-center">
            <h1 className={`${classes.h1}`}>Transactions</h1>
          </div>
          {!isFetching && !isError && (
            <div className="flex flex-wrap items-center space-x-2">
              <DownloadCsvDropdown
                variant="outline"
                onDownload={() => downloadCsv()}
                onSendEmail={sendEmailCsv}
                emailModalTitle="Send email"
              />
            </div>
          )}
        </div>

        {isError && (
          <Alert variant="error" description="Server error! Please try again." accentBorder />
        )}
        <FilterControls filter={filter} />
        <Filter filter={filter} labelText="Search results for" />
        <DataTable
          isLoading={isFetching}
          striped
          pagination={
            <PaginationNavigation
              total={data && data.total}
              currentPage={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <DataTableRow>
              <DataTableCell className="w-1/6">TRANSACTION TYPE</DataTableCell>
              <DataTableCell className="w-1/4">CARD NUMBER</DataTableCell>
              <DataTableCell className="w-1/9">STATUS</DataTableCell>
              <DataTableCell className="w-1/6 text-right">AMOUNT (RM)</DataTableCell>
              <DataTableCell className="w-1/5 text-right">CREATED DATE</DataTableCell>
            </DataTableRow>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {!isFetching &&
              !isEmptySwitchTransactionList &&
              data.switchTransactions.map((item: ITerminalSwitchTransactionResponseDto, index) =>
                mapTransactionToRow(item, index),
              )}
          </DataTableRowGroup>
          <DataTableCaption>
            {!isFetching && isEmptySwitchTransactionList && (
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No transaction was found</p>
              </div>
            )}
          </DataTableCaption>
        </DataTable>
        <Notification
          isShow={showNoti}
          variant={notiType}
          title={
            notiType === 'success'
              ? 'Request successfully. The csv will be sent shortly.'
              : 'Fail to request.'
          }
        />
      </div>
      {isFetching && <div data-testid="loading-temp-component"></div>}
    </>
  );
};
