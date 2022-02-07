import {
  Button,
  classes,
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  DownloadIcon,
  Label,
  Card,
  usePaginationState,
  useFilter,
  PaginationNavigation,
  Modal,
  ModalBody,
  DropdownSelect,
  DateRangeDropdown,
  SearchTextInput,
  Field,
  SearchableDropdown,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DataTableCaption,
  Badge,
  formatMoney,
  formatDate,
} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {OnDemandReportCategory} from 'src/react/services/api-reports.enum';
import {cardReportAccess} from 'src/shared/helpers/pdb.roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {SendReportForm} from '../../on-demand-reports/components/on-demand-report-send-report-form';
import {useGetMerchantsFilterBy} from '../../cards/card.queries';
import {useCardReportsDetails, useReportDataCustom} from '../card-reports.queries';
import {ECardStatus, onDemandReportUrls} from '../enum';
import {statusColor} from './table-report-data-common';
import classNames from 'classnames';

interface ItemTransaction {
  categoryCode?: string;
  itemName?: string;
  unitPrice?: string;
  quantity?: string;
  totalAmount?: string;
}

enum SearchBy {
  MERCHANT = 'merchant',
  CARDNUMBER = 'cardNumber',
}

const listColumnsNumber = ['Card balance'];

const GiftCardItemisedTransactionList: React.VFC = () => {
  const [merchant, setMerchant] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [showSendModal, setShowSendModal] = React.useState(false);
  const showMessage = useNotification();
  const [dateRange, setDateRange] = React.useState<[string, string]>(['', '']);
  const [searchText, setSearchText] = React.useState('');
  const [searchBy, setSearchBy] = React.useState<SearchBy>(null);
  const pagination = usePaginationState();
  const [{values}, {setValue}] = useFilter({
    date_start: dateRange[0],
    date_end: dateRange[1],
    merchantId: '',
    cardNumber: '',
    clientTz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const {data: resolvedData, isFetching} = useReportDataCustom({
    url: onDemandReportUrls.GIFT_CARD_ITEMISED_TRANSACTION,
    category: OnDemandReportCategory.CARD,
    perPage: pagination.perPage,
    page: pagination.page,
    ...values,
    ...{merchantId: searchBy === SearchBy.MERCHANT ? values.merchantId : ''},
    ...{
      cardNumber: searchBy === SearchBy.CARDNUMBER ? values.cardNumber : '',
    },
  });
  const {data: reportDetails} = useCardReportsDetails(
    OnDemandReportCategory.CARD,
    onDemandReportUrls.GIFT_CARD_ITEMISED_TRANSACTION_DOWNLOAD,
  );

  const data = React.useMemo(() => {
    return resolvedData && resolvedData.filter((item) => !item.exportOnly).filter(Boolean)[0];
  }, [resolvedData]);

  const {data: dataMerchants} = useGetMerchantsFilterBy({
    page: 1,
    perPage: 100,
    name: searchText,
  });

  const optMerchants =
    dataMerchants &&
    dataMerchants.items.map((merchant) => ({
      value: merchant.merchantId,
      label: merchant.name,
    }));

  const dismissSendModal = React.useCallback(() => {
    setShowSendModal(false);
  }, []);

  const displayContentTd = ({
    value,
    type,
    filed,
    listColumnsNumber,
  }: {
    value: string;
    type: string;
    filed: string;
    listColumnsNumber: string[];
  }) => {
    if (type === 'number' && listColumnsNumber.includes(filed)) {
      return formatMoney(value as any);
    }

    if (type === 'timestamp' || type === 'date') {
      return (
        value &&
        formatDate(value, {
          format: 'dd MMM yyyy, hh:mm:ss a',
        })
      );
    }

    if (Object.values(ECardStatus).includes(value as ECardStatus)) {
      return (
        <Badge color={statusColor(value as string)} rounded="rounded" className="uppercase">
          {value}
        </Badge>
      );
    }

    return value;
  };

  return (
    <>
      <HasPermission accessWith={[cardReportAccess.view]}>
        <div className="grid gap-4 pt-6 max-w-6xl mx-auto px-4 sm:px-6 mb-15 relative">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Gift card itemised transaction</h1>
            <HasPermission accessWith={[cardReportAccess.download]}>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSendModal(true);
                }}
                leftIcon={<DownloadIcon />}>
                DOWNLOAD CSV
              </Button>
            </HasPermission>
          </div>
          <Card className="mb-4">
            <div className="grid grid-cols-4 gap-5 p-5">
              <Field>
                <Label>Search by</Label>
                <DropdownSelect
                  options={[
                    {
                      label: 'All',
                      value: '',
                    },
                    {
                      label: 'Merchant',
                      value: SearchBy.MERCHANT,
                    },
                    {
                      label: 'Card number',
                      value: SearchBy.CARDNUMBER,
                    },
                  ]}
                  value={searchBy}
                  onChangeValue={(value: SearchBy) => {
                    pagination.setPage(1);

                    setSearchBy(value);
                  }}
                  placeholder="All"
                  className="col-span-2"
                />
              </Field>
              <Field className="pt-6 col-span-2">
                {searchBy === SearchBy.MERCHANT ? (
                  <SearchableDropdown
                    value={merchant}
                    onChangeValue={(value) => {
                      pagination.setPage(1);
                      setMerchant(value);
                      setValue('merchantId', value);
                    }}
                    options={optMerchants}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchText(e.target.value);
                    }}
                    placeholder="Please select"
                  />
                ) : (
                  <SearchTextInput
                    placeholder={
                      searchBy ? 'Enter keyword...' : 'Enter merchant name or card number...'
                    }
                    disabled={!searchBy}
                    value={searchBy === SearchBy.CARDNUMBER ? cardNumber : ''}
                    onChangeValue={(value) => {
                      pagination.setPage(1);
                      setValue('cardNumber', value);
                      setCardNumber(value);
                    }}
                  />
                )}
              </Field>
              <Field className="col-span-2">
                <DateRangeDropdown
                  label="Transaction on"
                  value={dateRange}
                  onChangeValue={(value) => {
                    pagination.setPage(1);
                    setValue('date_start', value[0]);
                    setValue('date_end', value[1]);
                    setDateRange(value);
                  }}
                  dayOnly
                  disableFuture
                  customRangeFormatType="dateOnly"
                />
              </Field>
            </div>
          </Card>
          <DataTable
            striped
            isLoading={isFetching}
            pagination={
              data &&
              data.paginated && (
                <PaginationNavigation
                  onChangePage={pagination.setPage}
                  total={data.paginated.record_count}
                  currentPage={data.paginated.page}
                  perPage={data.paginated.page_size}
                  onChangePageSize={pagination.setPerPage}
                />
              )
            }>
            {!resolvedData && (
              <>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td>Transaction on</Td>
                    <Td>Card number</Td>
                    <Td>Merchant ID</Td>
                    <Td>Merchant name</Td>
                    <Td>Total trans. amount (RM)</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup groupType="tbody"></DataTableRowGroup>
              </>
            )}
            {data && (
              <>
                <DataTable native>
                  <DataTableRowGroup groupType="thead">
                    <Tr>
                      {data.final_fields.map(
                        (field, fIndex) =>
                          field !== 'children' && (
                            <Td
                              key={fIndex}
                              className={classNames({
                                'text-right': fIndex === 4,
                              })}>
                              {field}
                            </Td>
                          ),
                      )}
                    </Tr>
                  </DataTableRowGroup>
                  <DataTableRowGroup groupType="tbody">
                    {data.values.length === 0 ? (
                      <DataTableCaption className="py-5">
                        <b className="absolute inset-x-0 py-5 text-center font-normal">
                          You have no data to be displayed here
                        </b>
                        <div className="w-full h-14"></div>
                      </DataTableCaption>
                    ) : (
                      data.values.map((row, rIndex) => (
                        <ExpandGroup
                          key={
                            rIndex +
                            '' +
                            pagination.page +
                            merchant +
                            cardNumber +
                            dateRange[0] +
                            dateRange[1]
                          }>
                          <Tr key={rIndex}>
                            {row.map(
                              (cell, cIndex) =>
                                cIndex < 5 && (
                                  <Td
                                    key={cIndex}
                                    className={classNames(
                                      {
                                        'text-right': data.final_fields.length - 2 === cIndex,
                                      },
                                      {'w-1/5': cIndex === 4},
                                      {
                                        'pl-9':
                                          !JSON.parse((data.values as unknown)[rIndex][5])[0] &&
                                          cIndex === 0,
                                      },
                                    )}>
                                    {cIndex === 0 &&
                                      JSON.parse((data.values as unknown)[rIndex][5])[0] && (
                                        <ExpandButton className="pb-2" />
                                      )}
                                    {displayContentTd({
                                      value: cell as string,
                                      type: data.final_column_types[cIndex],
                                      filed: data.final_fields[cIndex],
                                      listColumnsNumber: listColumnsNumber,
                                    })}
                                  </Td>
                                ),
                            )}
                          </Tr>
                          <ExpandableRow style={{padding: 0}} className="mr-5">
                            <DataTable>
                              <DataTable.Thead>
                                <Tr>
                                  <Td className="text-left" style={{paddingLeft: '1.5rem'}}>
                                    Item code
                                  </Td>
                                  <Td>Item name</Td>
                                  <Td className="text-right">Price per unit (RM)</Td>
                                  <Td className="text-right">Qty.</Td>
                                  <Td className="text-right">Item amount (RM)</Td>
                                </Tr>
                              </DataTable.Thead>
                              <DataTable.Tbody>
                                {(
                                  JSON.parse(
                                    (data.values as unknown)[rIndex][5],
                                  ) as Array<ItemTransaction>
                                ).map((item, i) => (
                                  <Tr key={i}>
                                    <Td className="text-left" style={{paddingLeft: '1.5rem'}}>
                                      {item?.categoryCode}
                                    </Td>
                                    <Td>{item?.itemName}</Td>
                                    <Td className="text-right">{item?.unitPrice}</Td>
                                    <Td className="text-right">{item?.quantity}</Td>
                                    <Td className="text-right">{item?.totalAmount}</Td>
                                  </Tr>
                                ))}
                              </DataTable.Tbody>
                            </DataTable>
                          </ExpandableRow>
                        </ExpandGroup>
                      ))
                    )}
                  </DataTableRowGroup>
                </DataTable>
              </>
            )}
          </DataTable>
        </div>
      </HasPermission>
      {/* send email modal*/}
      <Modal aria-label="send report" isOpen={showSendModal} onDismiss={dismissSendModal}>
        <ModalBody>
          This CSV file will be sent to the email you enter down below. You may enter multiple email
          addresses separated by commas.
        </ModalBody>
        <SendReportForm
          reportName={reportDetails?.reportName}
          filter={values}
          onSuccess={() => {
            showMessage({
              title: 'Report requested.',
              description: 'You will be notified when the report is ready.',
            });
            dismissSendModal();
          }}
          onDismiss={dismissSendModal}
        />
      </Modal>
      {/* send email modal - END */}
    </>
  );
};

export default GiftCardItemisedTransactionList;
