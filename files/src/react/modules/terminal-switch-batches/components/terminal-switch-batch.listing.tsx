import {
  Alert,
  Badge,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  Filter,
  FilterControls,
  formatDate,
  InfoIcon,
  Notification,
  PaginationNavigation,
  useFilter,
  usePaginationState,
  useTransientState,
} from '@setel/portal-ui';
import React from 'react';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {useMountSafe} from 'src/react/hooks/use-mount-safe';
import {
  downloadTerminalSwitchBatches,
  sentTerminalSwitchBatchesViaEmail,
} from 'src/react/modules/terminal-switch-batches/terminal-switch-batches.service';
import {Link} from 'src/react/routing/link';
import {useGetMerchants} from '../../terminal-switch-transactions/terminal-switch-transaction.service';
import {
  AcquirerType2Text,
  AcquirerTypeOptions,
  CardBrand2Text,
  CardBrandOptions,
  TerminalSwitchBatchStatusOptions,
} from '../constant';
import {useTerminalSwitchBatches} from '../terminal-switch-batch.query';
import {BatchStatus, IBatchesResponseDto} from '../terminal-switch-batches.type';
import {BatchStatusColorMapping} from './constant';

export const TerminalSwitchBatchesListing = ({isForceClose = false}: {isForceClose?: boolean}) => {
  const [batchNum, setBatchNum] = React.useState('');
  const [terminalId, setTerminalId] = React.useState('');

  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name: merchantSearchValue});
  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: 20,
  });

  //notification
  const [showNoti, setShowNoti] = useTransientState(false);
  const setShowNotiSafe = useMountSafe(setShowNoti);
  const [notiType, setNotiType] = React.useState<'success' | 'error' | undefined>(undefined);
  const setNotiTypeSafe = useMountSafe(setNotiType);

  const filter = useFilter(
    {
      status: '',
      terminalId: '',
      merchantId: '',
      batchNum: '',
      dateRange: ['', ''] as [string, string],
      acquirerType: '',
      cardBrand: '',
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            placeholder: 'All statuses',
            options: TerminalSwitchBatchStatusOptions,
          },
        },
        {
          key: 'acquirerType',
          type: 'select',
          props: {
            label: 'Acquirer Type',
            placeholder: 'All acquirer types',
            options: AcquirerTypeOptions,
          },
        },
        {
          key: 'cardBrand',
          type: 'select',
          props: {
            label: 'Card Brand',
            placeholder: 'All card brands',
            options: CardBrandOptions,
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
            label: 'Batch Number',
            placeholder: 'Search by Batch Number',
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
            wrapperClass: 'col-span-1',
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

  const requestFilter = React.useMemo(
    () => ({
      merchantId: values.merchantId,
      terminalId: values.terminalId,
      status: values.status,
      batchNum: values.batchNum,
      from: values.dateRange[0],
      to: values.dateRange[1],
      acquirerType: values.acquirerType,
      cardBrands: values.cardBrand ? [values.cardBrand] : undefined,
      page,
      perPage,
      isPendingForceCloseApprovalOnly: isForceClose,
    }),
    [values, page, perPage],
  );

  const mapSwitchBatchToRow = (batch: IBatchesResponseDto, index: number) => {
    const {
      merchantName,
      terminalId,
      batchNum,
      createdAt: rawCreatedAT,
      status,
      acquirerType,
      cardBrands,
      hasExclamationMark,
    } = batch;
    const createdAt =
      rawCreatedAT &&
      formatDate(rawCreatedAT, {
        formatType: 'dateAndTime',
      });
    return (
      <DataTableRow
        key={index}
        className="flex items-center"
        render={(props) => {
          return (
            <Link
              data-testid="terminal-switch-batch-row"
              to={`gateway/${isForceClose ? 'force-close-approval' : 'batches'}/${batch.id}`}
              {...props}
            />
          );
        }}>
        <DataTableCell className="w-72">{merchantName}</DataTableCell>
        <DataTableCell className="w-52">{terminalId}</DataTableCell>
        <DataTableCell className="w-40">{batchNum}</DataTableCell>
        <DataTableCell className="w-52">{AcquirerType2Text[acquirerType]}</DataTableCell>
        <DataTableCell className="w-30">
          <Badge rounded="rounded" color={BatchStatusColorMapping[status]}>
            {status}
          </Badge>
        </DataTableCell>
        <DataTableCell className="w-40">
          {cardBrands?.map((cardBrand, index) => {
            return (
              <div className="inline-flex" key={index}>
                <div className="p-2 bd-highlight">{CardBrand2Text[cardBrand]}</div>
              </div>
            );
          })}
        </DataTableCell>
        <DataTableCell className="text-right w-64">
          <div className="inline-flex items-center space-x-4">
            <span>{createdAt}</span>
            {!isForceClose && hasExclamationMark && (
              <InfoIcon
                className={status === BatchStatus.CLOSED ? 'text-transparent' : 'text-warning-500'}
              />
            )}
          </div>
        </DataTableCell>
      </DataTableRow>
    );
  };

  const {data, isFetching, isError} = useTerminalSwitchBatches(requestFilter);
  const isEmptySwitchBatchesList = data && data.switchBatches && data.switchBatches.length === 0;

  const downloadCsv = React.useCallback(() => {
    const {page, perPage, ...rest} = requestFilter;
    return downloadTerminalSwitchBatches(rest);
  }, [requestFilter]);

  const sendEmailCsv = React.useCallback(
    async (email: string[]) => {
      const {page, perPage, ...rest} = requestFilter;
      await sentTerminalSwitchBatchesViaEmail(email, rest)
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
            <h1 className={`${classes.h1}`}>
              {isForceClose ? 'Force close approval' : 'Batch reports'}
            </h1>
          </div>

          {!isFetching && !isError && !isForceClose && (
            <div className="flex flex-wrap items-center space-x-2">
              <DownloadCsvDropdown
                variant="outline"
                emailModalTitle="Send email"
                onDownload={downloadCsv}
                onSendEmail={sendEmailCsv}
              />
            </div>
          )}
        </div>
        {isError && (
          <Alert variant="error" description="Server error! Please try again." accentBorder />
        )}
        <FilterControls filter={filter} />
        <Filter filter={filter} labelText="Search result for" />
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
            <DataTableRow className="flex items-center">
              <DataTableCell className="w-72">MERCHANT NAME</DataTableCell>
              <DataTableCell className="w-52">TERMINAL ID</DataTableCell>
              <DataTableCell className="w-40">BATCH NO</DataTableCell>
              <DataTableCell className="w-52">ACQUIRER TYPE</DataTableCell>
              <DataTableCell className="w-30">STATUS</DataTableCell>
              <DataTableCell className="w-40">CARD BRAND</DataTableCell>
              <DataTableCell className="w-64 text-right">CREATED DATE</DataTableCell>
            </DataTableRow>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {!isFetching &&
              !isEmptySwitchBatchesList &&
              data.switchBatches.map(mapSwitchBatchToRow)}
          </DataTableRowGroup>
          <DataTableCaption>
            {!isFetching && isEmptySwitchBatchesList && (
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No Batch was found</p>
              </div>
            )}
          </DataTableCaption>
          <Notification
            isShow={showNoti}
            variant={notiType}
            title={
              notiType === 'success'
                ? 'Request successfully. The csv will be sent shortly.'
                : 'Fail to request.'
            }
          />
        </DataTable>
      </div>
      {isFetching && <div data-testid="loading-temp-component"></div>}
    </>
  );
};
