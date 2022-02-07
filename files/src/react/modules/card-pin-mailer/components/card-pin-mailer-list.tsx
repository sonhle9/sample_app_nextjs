import {
  Alert,
  AlertMessages,
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  DataTable as Table,
  DataTableCaption,
  Dialog,
  DocIcon,
  DownloadIcon,
  Filter,
  FilterControls,
  formatDate,
  HelpText,
  Notification,
  PaginationNavigation,
  PrinterIcon,
  ReloadIcon,
  Text,
  Progress,
  useAjaxOperations,
  BareButton,
} from '@setel/portal-ui';
import moment from 'moment';
import React, {useEffect} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {cardPinMailer} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {useGetMerchantsFilterBy, useGetCards} from '../../cards/card.queries';
import {FilterBy} from '../../cards/card.type';
import {usePrintCard} from '../card-pin-mailer.queries';
import {downloadPinMailers, getCardPinMailer} from '../card-pin-mailer.service';
import {
  cardPinMailerColorStatus,
  cardPinMailerTypeTextPair,
  ECardPinMailerStatus,
  optCardPinMailerStatusFilter,
  optCardPinMailerTypeFilter,
} from '../card-pin-mailer.type';

interface FilterValue {
  status: ECardPinMailerStatus;
  range: [string, string];
  type: string;
  merchantName: string;
  cardNumber: string;
}

const computeFilterValues = ({
  range: [dateFrom, dateTo],
  merchantName: merchantId,
  ...filter
}: FilterValue & {page: number; perPage: number}) => {
  return {
    ...filter,
    merchantId,
    dateFrom,
    dateTo,
  };
};

function CardPinMailerList() {
  const [valueSelected, setValuesSelected] = React.useState<string[]>([]);
  const [oldPinMailerSelected, setOldPinMailerSelected] = React.useState<string[]>([]);
  const [searchMerchantName, setSearchMerchantName] = React.useState('');
  const [searchCardNumber, setSearchCardNumber] = React.useState('');
  const {data: merchantList} = useGetMerchantsFilterBy({name: searchMerchantName});
  const {data: cardList} = useGetCards({
    filterBy: FilterBy.cardNumber,
    ...(searchCardNumber && {values: [searchCardNumber]}),
  });
  const [showConfirmActionPrint, setShowConfirmActionPrint] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const cancelRef = React.useRef(null);

  const initialFilter: FilterValue = {
    type: '',
    status: null,
    range: ['', ''],
    merchantName: '',
    cardNumber: '',
  };

  const {
    query: {data, isFetching, refetch},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'cards_pin_mailer',
    queryFn: (currentValues) => getCardPinMailer(computeFilterValues(currentValues)),
    components: () => [
      {
        key: 'type',
        type: 'select',
        props: {
          label: 'Type',
          options: optCardPinMailerTypeFilter,
          placeholder: 'Any types',
        },
      },
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: optCardPinMailerStatusFilter,
          placeholder: 'Any statuses',
        },
      },
      {
        key: 'range',
        type: 'daterange',
        props: {
          label: 'Created on',
          dayOnly: true,
          placeholder: 'Any date',
        },
      },
      {
        key: 'cardNumber',
        type: 'searchableselect',
        props: {
          label: 'Card number',
          wrapperClass: 'col-span-2 col-start-1',
          placeholder: 'Enter card number',
          onInputValueChange: setSearchCardNumber,
          options: (cardList?.items || []).map((card) => ({
            value: card.cardNumber,
            label: card.cardNumber,
          })),
        },
      },
      {
        key: 'merchantName',
        type: 'searchableselect',
        props: {
          options: (merchantList?.items || []).map((merchant) => ({
            value: merchant.merchantId,
            label: merchant.name,
            description: `Merchant ID : ${merchant.merchantId}`,
          })),
          label: 'Merchant name',
          wrapperClass: 'col-span-2',
          placeholder: 'Enter merchant name...',
          onInputValueChange: setSearchMerchantName,
        },
      },
    ],
  });
  const [{values: filterValues}] = filter;
  const dataExceptStatusPrinting = data?.items.reduce((arr, item) => {
    if (item.status !== ECardPinMailerStatus.PRINTING) {
      return arr.concat(item);
    }
    return arr;
  }, []);

  useEffect(() => {
    setValuesSelected([]);
  }, [window.location.search]);

  const close = () => {
    setShowConfirmActionPrint(false);
    setErrorMsg(null);
  };

  const {mutate: printCardPinMailer} = usePrintCard();
  const handlerActionPrint = () => {
    printCardPinMailer(valueSelected, {
      onSuccess: () => {
        setValuesSelected([]);
        close();
        refetch();
      },
      onError: (err: any) => {
        const res = err.response && err.response.data;
        if (res && res.statusCode) {
          setErrorMsg([res.message]);
        }
      },
    });
  };

  const isDisabledPrint = React.useMemo(() => {
    return oldPinMailerSelected.length > 0;
  }, [oldPinMailerSelected.length]);

  const {add, items} = useAjaxOperations({
    operation: downloadPinMailers,
    autoRemoveDelayWhenSuccess: 3000,
    onChange: (res) => {
      if (res[0]) {
        const link = window.URL.createObjectURL(res[0]);
        const nameFile = `PIN_mailer_${moment().format('YYYYMMDD')}.csv`;
        const fileLink = document.createElement('a');
        fileLink.style.display = 'none';
        fileLink.href = link;
        fileLink.download = nameFile;
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
        window.URL.revokeObjectURL(link);
      }
    },
  });
  return (
    <HasPermission accessWith={[cardPinMailer.view]}>
      {items[0] && (
        <Notification
          title={`PIN_mailer_${moment().format('YYYYMMDD')}.csv`}
          Icon={
            items[0]?.status === 'pending'
              ? DocIcon
              : items[0]?.status === 'error'
              ? ReloadIcon
              : undefined
          }
          variant={items[0]?.status === 'pending' ? undefined : 'success'}
          description={
            items[0]?.status === 'pending' ? (
              <div className="w-96">Preparing to download. Please wait...</div>
            ) : items[0]?.status === 'error' ? (
              <div className="w-96 text-error-500">File error. Please try again.</div>
            ) : (
              <div className="w-96 tracking-wider font-medium text-brand-500">DOWNLOAD FILE</div>
            )
          }
          onDismiss={() => {
            items[0]?.onRemove;
          }}
          key="Notification">
          {items[0]?.status === 'pending' && <Progress progress={items[0].progress} />}
        </Notification>
      )}

      <PageContainer
        heading="Card PIN mailer"
        action={
          <Button
            onClick={() => {
              add(
                computeFilterValues({
                  ...filterValues,
                  page: pagination.page,
                  perPage: pagination.perPage,
                }),
              );
            }}
            rightIcon={<DownloadIcon />}
            variant="outline">
            DOWNLOAD CSV
          </Button>
        }
        className="space-y-7 mt-4 max-w-6xl">
        <FilterControls filter={filter} className="grid grid-cols-4 pl-7" />
        <Filter labelText="Search results for:" filter={filter} />
        <Table
          isFetching={isFetching}
          striped
          responsive
          pagination={
            <PaginationNavigation
              total={data && data.total}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }
          heading={
            <div className="px-7 py-4 flex bg-lightergrey border-b">
              {valueSelected.length !== 0 ? (
                <HelpText className="text-sm flex flex-row items-center">
                  {valueSelected.length === dataExceptStatusPrinting.length
                    ? 'All'
                    : valueSelected.length}{' '}
                  {valueSelected.length > 1 ? 'items selected' : 'item selected'}
                  <BareButton
                    onClick={() => setShowConfirmActionPrint(true)}
                    disabled={isDisabledPrint}
                    className="flex flex-row items-center ml-3 text-brand-500 bg-opacity-0 hover:bg-opacity-25 focus:outline-none tracking-1">
                    <PrinterIcon /> <span className="mt-1 ml-2">PRINT</span>
                  </BareButton>
                </HelpText>
              ) : (
                <HelpText className="text-sm">No item selected</HelpText>
              )}
            </div>
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Td className="w-7 pr-0">
                {data && data?.items.length ? (
                  <Checkbox
                    checked={
                      valueSelected.length === dataExceptStatusPrinting.length &&
                      dataExceptStatusPrinting.length
                        ? true
                        : valueSelected.length > 0
                        ? 'mixed'
                        : false
                    }
                    onChangeValue={(checkedAll) => {
                      if (checkedAll) {
                        setValuesSelected(dataExceptStatusPrinting.map((item) => item.id));
                        setOldPinMailerSelected(
                          dataExceptStatusPrinting.filter((pinMailer) => {
                            if (pinMailer?.isLatest !== true) {
                              return pinMailer.id;
                            }
                          }),
                        );
                      } else {
                        setValuesSelected([]);
                        setOldPinMailerSelected([]);
                      }
                    }}
                  />
                ) : (
                  <Checkbox checked={false} disabled />
                )}
              </Table.Td>
              <Table.Td>Type</Table.Td>
              <Table.Td>Status</Table.Td>
              <Table.Td>Card number</Table.Td>
              <Table.Td>Merchant name</Table.Td>
              <Table.Td className="text-right">Created on</Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(data?.items || []).map((cardPin) => {
              return (
                <Table.Tr key={cardPin.id} className="cursor-pointer">
                  <Table.Td className="w-7 pr-0">
                    <CheckboxGroup
                      name="cardPin"
                      value={valueSelected}
                      onChangeValue={setValuesSelected}>
                      {cardPin && cardPin?.status !== ECardPinMailerStatus.PRINTING ? (
                        <Checkbox
                          key={cardPin.id}
                          onChangeValue={(value) => {
                            setOldPinMailerSelected((state) => {
                              if (value === true && cardPin?.isLatest !== true) {
                                state.push(cardPin.id);
                              } else {
                                const index = state.indexOf(cardPin.id);
                                if (index > -1) {
                                  state.splice(index, 1);
                                }
                              }
                              return state;
                            });
                          }}
                          value={cardPin.id}
                          checked={true}
                        />
                      ) : (
                        <Checkbox
                          key={cardPin.id}
                          checked={false}
                          disabled
                          className="opacity-30"
                        />
                      )}
                    </CheckboxGroup>
                  </Table.Td>

                  <Table.Td>{cardPin && cardPinMailerTypeTextPair[cardPin?.type]}</Table.Td>

                  <Table.Td>
                    {cardPin?.status && (
                      <Badge
                        color={cardPinMailerColorStatus[cardPin.status]}
                        rounded="rounded"
                        className="uppercase">
                        {cardPin && cardPin?.status}
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>{cardPin?.cardNumber}</Table.Td>
                  <Table.Td>{cardPin?.merchantName}</Table.Td>
                  <Table.Td className="text-right">
                    {cardPin?.createdAt &&
                      formatDate(cardPin.createdAt, {
                        formatType: 'dateAndTime',
                      })}
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>

          {!data?.items.length && (
            <DataTableCaption className="py-24">
              <Text color="lightgrey" className="text-center">
                No items found
              </Text>
            </DataTableCaption>
          )}

          {showConfirmActionPrint && (
            <Dialog onDismiss={close} leastDestructiveRef={cancelRef} className="mt-96">
              <Dialog.Content header="Are you sure you want to print?">
                {errorMsg && (
                  <div className="py-2">
                    <Alert variant="error" description="Something is error">
                      <AlertMessages messages={errorMsg} />
                    </Alert>
                  </div>
                )}
                Total PINs to be printed: {valueSelected.length}
              </Dialog.Content>
              <Dialog.Footer>
                <Button variant="outline" onClick={close} ref={cancelRef}>
                  CANCEL
                </Button>
                <Button variant="primary" onClick={handlerActionPrint}>
                  CONFIRM
                </Button>
              </Dialog.Footer>
            </Dialog>
          )}
        </Table>
      </PageContainer>
    </HasPermission>
  );
}

export default CardPinMailerList;
