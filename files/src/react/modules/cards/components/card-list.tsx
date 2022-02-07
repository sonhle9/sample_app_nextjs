import {
  Button,
  classes,
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  formatDate,
  PaginationNavigation,
  Badge,
  DropdownMenu,
  DropdownMenuItems,
  DropdownItem,
  Filter,
  FilterControls,
  PlusIcon,
  positionRight,
  DataTableCaption,
  DataTableRowProps,
  Card,
} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {
  useDownloadCards,
  useGetCardGroupsFilterBy,
  useGetCompaniesFilterBy,
  useGetMerchantsFilterBy,
} from '../card.queries';
import {ColorMap, EStatus} from 'src/app/cards/shared/enums';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {EditMode, ESortBy, FilterBy, FilterByMap, FleetPlan, ICard, StatusMap} from '../card.type';
import {CardModal} from './card-modal';
import CardImportFileModal from './card-import-file-modal';
import moment from 'moment';
import {CardSendEmailModal} from './card-send-email-modal';
import {BulkCardStatusModal} from './bulk-card-status-modal';
import {Link} from 'src/react/routing/link';
import {getCards} from '../card.service';
import {HasPermission} from '../../auth/HasPermission';
import {cardRole} from 'src/shared/helpers/roles.type';
import {EType} from 'src/shared/enums/card.enum';
import {environment} from 'src/environments/environment';

interface ICardProps {
  cardType?: EType;
  isActive?: boolean;
  title?: string;
}

interface FilterValue {
  filterBy: FilterBy;
  companyId: string;
  cardGroupId: string;
  selectedMerchants: string;
  cardNumberSearchText: string;
  status: EStatus;
  dateRange: [string, string];
  sort?: ESortBy;
  type: EType;
}

const computeFilterValues = ({
  dateRange: [dateFrom, dateTo],
  filterBy,
  companyId,
  cardGroupId,
  cardNumberSearchText,
  selectedMerchants,
  ...filter
}: FilterValue & {page: number; perPage: number}) => {
  const values = (
    filterBy === FilterBy.company
      ? [companyId]
      : filterBy === FilterBy.cardGroup
      ? [cardGroupId]
      : filterBy === FilterBy.merchant
      ? [selectedMerchants]
      : [cardNumberSearchText]
  ).filter(Boolean);

  return {
    ...filter,
    filterBy,
    values: values.length > 0 ? values : undefined,
    dateFrom,
    dateTo,
  };
};

export const CardList = (props: ICardProps) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [importFileModal, setImportFileModal] = React.useState(false);
  const showMessage = useNotification();
  const [merchantSearchText, setMerchantSearchText] = React.useState('');
  const [cardGroupSearchText, setCardGroupSearchText] = React.useState('');
  const [companySearchText, setCompanySearchText] = React.useState('');

  const {data: merchantList} = useGetMerchantsFilterBy({name: merchantSearchText});
  const {data: cardGroupList} = useGetCardGroupsFilterBy({search: cardGroupSearchText});
  const {data: companiesList} = useGetCompaniesFilterBy({
    perPage: 15,
    page: 1,
    sortDate: 'desc',
    keyWord: companySearchText,
  });

  const initialFilter: FilterValue = {
    filterBy: null,
    companyId: '',
    cardGroupId: '',
    selectedMerchants: '',
    cardNumberSearchText: '',
    status: null,
    dateRange: ['', ''],
    type: props?.cardType,
  };

  const {
    query: {data, isFetching},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'cards',
    queryFn: (currentValues) => getCards(computeFilterValues(currentValues)),
    components: ({filterBy}) => [
      {
        type: 'select',
        key: 'status',
        props: {
          label: 'Status',
          options: StatusMap,
          placeholder: 'All statuses',
        },
      },
      {
        type: 'daterange',
        key: 'dateRange',
        props: {
          label: 'Created on',
          wrapperClass: 'sm:col-span-2',
        },
      },
      {
        type: 'select',
        key: 'filterBy',
        props: {
          label: 'Search by',
          options: FilterByMap,
          placeholder: 'All',
          wrapperClass: 'col-start-1',
        },
      },
      filterBy === FilterBy.company
        ? {
            type: 'searchableselect',
            key: 'companyId',
            props: {
              options: companiesList,
              onInputValueChange: setCompanySearchText,
              wrapperClass: 'sm:col-span-2',
            },
          }
        : filterBy === FilterBy.merchant
        ? {
            type: 'searchableselect',
            key: 'selectedMerchants',
            props: {
              options:
                merchantList &&
                merchantList.items.map((merchant) => ({
                  value: merchant.merchantId,
                  label: merchant.name,
                })),
              onInputValueChange: setMerchantSearchText,
              wrapperClass: 'sm:col-span-2',
            },
          }
        : filterBy === FilterBy.cardGroup
        ? {
            type: 'searchableselect',
            key: 'cardGroupId',
            props: {
              options: cardGroupList,
              onInputValueChange: setCardGroupSearchText,
              wrapperClass: 'sm:col-span-2',
            },
          }
        : {
            type: 'search',
            key: 'cardNumberSearchText',
            props: {
              placeholder: filterBy ? 'Enter keyword...' : 'Select search by',
              disabled: !filterBy,
              wrapperClass: 'sm:col-span-2',
            },
          },
    ],
    propExcludedFromApplied: ['filterBy'],
  });

  const [{values: filterValues}] = filter;
  const filterByValue = filterValues.filterBy;
  const status = filterValues.status;

  const {mutate: downloadCards, isLoading: isDownloading} = useDownloadCards();

  const [sendEmailModal, setSendEmailModal] = React.useState(false);

  const [bulkCardStatusModal, setBulkCardStatusModal] = React.useState(false);

  const disabledUpdateCardsStatus =
    !status ||
    status === EStatus.CLOSED ||
    status === EStatus.PENDING ||
    !data ||
    data?.items.length === 0;

  const isNotGiftCard = React.useMemo(() => {
    return props?.cardType !== EType.GIFT;
  }, [props?.cardType]);

  const onDownloadDirect = () => {
    downloadCards(
      computeFilterValues({
        ...filterValues,
        page: pagination.page,
        perPage: pagination.perPage,
      }),
      {
        onSuccess: (link: string) => {
          const nameFile = `cards-${moment().format('YYYYMMDDhhmmss')}.csv`;
          const fileLink = document.createElement('a');
          fileLink.style.display = 'none';
          fileLink.href = link;
          fileLink.download = nameFile;
          document.body.appendChild(fileLink);
          fileLink.click();
          document.body.removeChild(fileLink);
          window.URL.revokeObjectURL(link);
        },
      },
    );
  };

  React.useEffect(() => {
    if (!props?.isActive) {
      filter[1].reset();
    }
  }, [props.isActive, props.cardType]);

  return (
    <>
      <HasPermission accessWith={[cardRole.view]}>
        <div className="grid pt-8 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <Card
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}>
            <div className="py-4 px-4 sm:px-7 border-b border-gray-200">
              <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
                <h1 className={classes.h1}>{props.title || 'Cards'}</h1>
                <div>
                  <HasPermission accessWith={[cardRole.create]}>
                    <Button
                      disabled={isNotGiftCard}
                      variant="primary"
                      leftIcon={<PlusIcon />}
                      onClick={() => {
                        setVisibleModal(true);
                      }}>
                      CREATE
                    </Button>
                  </HasPermission>
                  <DropdownMenu
                    variant="outline"
                    label="MORE"
                    className="align-bottom ml-3"
                    disabled={isDownloading}>
                    <DropdownMenuItems className="min-w-32 font-normal" getPosition={positionRight}>
                      <HasPermission accessWith={[cardRole.download]}>
                        <DropdownItem onSelect={onDownloadDirect}>
                          <span className="text-black hidden"> Direct download </span>
                        </DropdownItem>
                      </HasPermission>
                      <DropdownItem onSelect={() => setSendEmailModal(true)}>
                        <span className="text-black"> Send email </span>
                      </DropdownItem>
                      <HasPermission accessWith={[cardRole.bulk_transfer]}>
                        <DropdownItem
                          disabled={isNotGiftCard}
                          onSelect={() => {
                            setImportFileModal(true);
                          }}>
                          <span className={isNotGiftCard ? 'text-fieldborder' : 'text-black'}>
                            {' '}
                            Import card transfer CSV{' '}
                          </span>
                        </DropdownItem>
                      </HasPermission>
                      <HasPermission accessWith={[cardRole.bulkcardstatus_update]}>
                        <DropdownItem
                          disabled={disabledUpdateCardsStatus}
                          onSelect={() => {
                            setBulkCardStatusModal(true);
                          }}>
                          <span
                            className={
                              disabledUpdateCardsStatus ? 'text-fieldborder' : 'text-black'
                            }>
                            {' '}
                            Bulk card status update{' '}
                          </span>
                        </DropdownItem>
                      </HasPermission>
                    </DropdownMenuItems>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <HasPermission accessWith={[cardRole.search]}>
              <FilterControls
                filter={filter}
                style={{
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
                className="grid grid-cols-4 pl-7"
              />
            </HasPermission>
          </Card>
          <Filter filter={filter} className="m-2" />
          <>
            <Card
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}>
              <DataTable
                striped
                pagination={
                  <PaginationNavigation
                    total={data && data.total}
                    currentPage={pagination.page}
                    perPage={pagination.perPage}
                    onChangePage={pagination.setPage}
                    onChangePageSize={pagination.setPerPage}
                  />
                }
                isFetching={isFetching}>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td className="w-72">Card Number</Td>
                    <Td className="w-56">Status</Td>
                    {filterByValue === FilterBy.merchant ? (
                      <Td className="w-96">Merchant name</Td>
                    ) : filterByValue === FilterBy.cardGroup ? (
                      <Td>Card Group</Td>
                    ) : filterByValue === FilterBy.company ? (
                      <Td>Company</Td>
                    ) : (
                      <Td className="w-96">Merchant name</Td>
                    )}
                    <Td className="text-right">Created on</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup groupType="tbody">
                  {(data?.items || []).map((card) => {
                    const ITr = ({
                      iCard,
                      children,
                    }: DataTableRowProps & {
                      iCard: ICard;
                    }) => {
                      if (iCard.type === EType.LOYALTY && !iCard.loyaltyMember) {
                        return <Tr>{children}</Tr>;
                      }
                      return (
                        <Tr
                          render={(props) => {
                            switch (iCard.type) {
                              case EType.FLEET:
                                return (
                                  <a
                                    {...props}
                                    target="_blank"
                                    href={`${environment.pdbWebDashboardUrl}/card-issuing/cards?merchantId=${iCard.merchantId}&cardId=${iCard.id}&redirect-from=admin`}
                                  />
                                );
                              case EType.LOYALTY:
                                if (iCard.loyaltyMember) {
                                  return (
                                    <Link
                                      {...props}
                                      to={`/loyalty/members/${iCard.loyaltyMember?.id}`}
                                    />
                                  );
                                }
                              default:
                                return <Link {...props} to={`/card-issuing/cards/${iCard.id}`} />;
                            }
                          }}>
                          {children}
                        </Tr>
                      );
                    };

                    return (
                      <ITr iCard={card} key={card.id}>
                        <Td className="h-8 pt-2 pb-2">
                          {card.type && (
                            <div className="float-left w-16 h-8 pr-4">
                              <img
                                style={{top: -5}}
                                src={`assets/images/logo-card/card-${
                                  card.type === EType.FLEET
                                    ? (card?.merchant?.smartPayAccountAttributes?.fleetPlan ||
                                        card?.merchant?.fleetPlan) === FleetPlan.POSTPAID
                                      ? FleetPlan.POSTPAID
                                      : FleetPlan.PREPAID
                                    : card.type
                                }.png`}
                                className="w-full h-8 relative"
                              />
                            </div>
                          )}
                          {card.cardNumber && card.cardNumber}
                        </Td>
                        <Td className="break-all">
                          {card.status && (
                            <Badge
                              className="tracking-wider font-semibold uppercase"
                              rounded="rounded"
                              color={ColorMap[card.status]}
                              style={{width: 'fit-content'}}>
                              {card && card.status}
                            </Badge>
                          )}
                        </Td>
                        {filterByValue === FilterBy.cardGroup ? (
                          <Td className="break-all">{card.cardGroup && card.cardGroup.name}</Td>
                        ) : filterByValue === FilterBy.company ? (
                          <Td className="break-all">{card.company && card.company.name}</Td>
                        ) : (
                          <Td className="break-all truncate max-w-sm">
                            {card.merchant && card.merchant.name}
                          </Td>
                        )}
                        <Td className="text-right">
                          {card.createdAt &&
                            formatDate(card.createdAt, {
                              formatType: 'dateAndTime',
                            })}
                        </Td>
                      </ITr>
                    );
                  })}
                </DataTableRowGroup>
                {data && !data?.items.length && (
                  <DataTableCaption>
                    <div className="py-5">
                      <div className="text-center py-5 text-md">
                        <p className="font-normal">You have no data to be displayed here</p>
                      </div>
                    </div>
                  </DataTableCaption>
                )}
              </DataTable>
            </Card>
          </>
        </div>
      </HasPermission>
      {visibleModal && (
        <CardModal
          visible={visibleModal}
          mode={EditMode.CREATE}
          onClose={() => {
            setVisibleModal(false);
          }}
        />
      )}
      {importFileModal && (
        <CardImportFileModal
          onClose={(s) => {
            setImportFileModal(false);
            if (s === 'success') {
              showMessage({
                title: 'Import card transfer success',
              });
            }
          }}
        />
      )}

      {sendEmailModal && (
        <CardSendEmailModal
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
      {bulkCardStatusModal && (
        <BulkCardStatusModal
          visible={bulkCardStatusModal}
          filters={computeFilterValues({
            ...filterValues,
            page: pagination.page,
            perPage: pagination.perPage,
          })}
          onClose={(statusCard: EStatus) => {
            if (statusCard !== filterValues.status) {
              filter[1].setValue('status', statusCard);
              filter[1].setValue('sort', ESortBy._UPDATED_AT);
            }
            setBulkCardStatusModal(false);
          }}
        />
      )}
    </>
  );
};
