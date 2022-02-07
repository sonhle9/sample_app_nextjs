import * as React from 'react';
import {
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTable,
  PaginationNavigation,
  formatDate,
  FilterControls,
  Filter,
  DropdownMenu,
  DropdownItem,
  DropdownMenuItems,
  Button,
  DataTableCaption,
  PlusIcon,
} from '@setel/portal-ui';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getCardholders} from '../cardholder.service';
import {FilterBy, FilterByMap} from '../cardholder.type';
import {HasPermission} from '../../auth/HasPermission';
import {cardHolderRole} from 'src/shared/helpers/roles.type';
import {environment} from 'src/environments/environment';
import {EType} from 'src/shared/enums/card.enum';
import {useRouter} from 'src/react/routing/routing.context';

interface FilterValue {
  filterBy: FilterBy;
  searchText: string;
  merchantId: string;
  dateCardholders: [string, string];
}

const initialFilter: FilterValue = {
  searchText: '',
  filterBy: null,
  merchantId: '',
  dateCardholders: ['', ''],
};

const computeFilterValues = ({
  dateCardholders: [dateFrom, dateTo],
  searchText,
  filterBy,
  merchantId,
  ...filter
}: FilterValue & {page: number; perPage: number}) => {
  const values =
    filterBy === FilterBy.idNumber
      ? searchText.trim()
      : filterBy === FilterBy.contactNumber
      ? searchText.trim()
      : searchText.trim();

  return {
    ...filter,
    filterBy,
    values,
    merchantId,
    dateFrom,
    dateTo,
  };
};

export const CardholderListing = () => {
  const router = useRouter();
  const {
    query: {data: data, isFetching},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'cardholders',
    queryFn: (currentValues) => getCardholders(computeFilterValues(currentValues)),
    components: ({filterBy}) => [
      {
        type: 'select',
        key: 'filterBy',
        props: {
          label: 'Search by',
          options: FilterByMap,
          placeholder: 'All',
          wrapperClass: 'lg:col-span-1',
        },
      },
      filterBy === FilterBy.idNumber
        ? {
            type: 'search',
            key: 'searchText',
            props: {
              placeholder: ' Search by passport and NRIC',
              wrapperClass: 'lg:col-span-2',
            },
          }
        : filterBy === FilterBy.contactNumber
        ? {
            type: 'search',
            key: 'searchText',
            props: {
              wrapperClass: 'lg:col-span-2',
              placeholder: 'Search by contact number',
            },
          }
        : filterBy === FilterBy.cardholderName
        ? {
            type: 'search',
            key: 'searchText',
            props: {
              wrapperClass: 'lg:col-span-2',
              placeholder: ' Search cardholder name or display name',
            },
          }
        : {
            type: 'search',
            key: 'searchText',
            props: {
              placeholder: filterBy ? 'Enter keyword...' : 'Select search by',
              disabled: !filterBy,
              wrapperClass: 'lg:col-span-2',
            },
          },
      {
        type: 'daterange',
        key: 'dateCardholders',
        props: {
          label: 'Created on',
          wrapperClass: 'lg:col-span-1 w-96 row-start-2',
        },
      },
    ],
    propExcludedFromApplied: ['filterBy'],
  });
  return (
    <>
      <HasPermission accessWith={[cardHolderRole.view]}>
        <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex justify-between mt-4">
            <h1 className="text-2xl font-medium leading-8">Cardholders</h1>
            <div>
              <HasPermission accessWith={[cardHolderRole.create]}>
                <Button variant="primary" leftIcon={<PlusIcon />} className="text-xs hidden">
                  CREATE
                </Button>
              </HasPermission>
              <DropdownMenu
                variant="outline"
                label="MORE"
                className="align-bottom ml-3 hidden"
                disabled={null}>
                <DropdownMenuItems>
                  <DropdownItem onSelect={null}>ADD</DropdownItem>
                </DropdownMenuItems>
              </DropdownMenu>
            </div>
          </div>
          <FilterControls
            filter={filter}
            className={
              filter[0].applied.length
                ? 'grid grid-rows-2 grid-cols-4'
                : 'grid grid-rows-2 grid-cols-4 mb-4'
            }
          />
          <Filter filter={filter} />
          <div className="bg-white overflow-hidden shadow sm:rounded-lg">
            <>
              <div>
                <DataTable
                  striped
                  pagination={
                    <PaginationNavigation
                      total={data?.total}
                      currentPage={pagination.page}
                      perPage={pagination.perPage}
                      onChangePage={pagination.setPage}
                      onChangePageSize={pagination.setPerPage}
                    />
                  }
                  isFetching={isFetching}>
                  <DataTableRowGroup groupType="thead">
                    <Tr>
                      <Td>Name</Td>
                      <Td>Card number</Td>
                      <Td>Merchant name</Td>
                      <Td className="text-right">Created on</Td>
                    </Tr>
                  </DataTableRowGroup>
                  <DataTableRowGroup>
                    {(data?.items || []).map((cardHolder, index) => (
                      <Tr
                        onClick={() => {
                          cardHolder?.card?.type === EType.FLEET
                            ? window.open(
                                `${environment.pdbWebDashboardUrl}/card-issuing/cardholders?merchantId=${cardHolder.card.merchantId}&cardholderId=${cardHolder.id}&redirect-from=admin`,
                                '_blank',
                              )
                            : router.navigateByUrl(`/card-issuing/cardholders/${cardHolder.id}`);
                        }}
                        key={index}>
                        <Td className="truncate max-w-xs">
                          {cardHolder?.name
                            ? cardHolder?.name
                            : cardHolder?.displayName
                            ? cardHolder?.displayName
                            : ''}
                        </Td>
                        <Td className="pb-1 pt-1">
                          {cardHolder?.card?.cardNumber && (
                            <div className="float-left w-16 h-8 pr-4">
                              <img
                                style={{top: -5}}
                                src={`assets/images/logo-card/card-${cardHolder?.card?.type}.png`}
                                className="w-full h-8 relative"
                              />
                            </div>
                          )}
                          {cardHolder?.card?.cardNumber && cardHolder?.card?.cardNumber}
                        </Td>
                        <Td className="truncate max-w-xs">
                          {cardHolder?.merchant?.name && cardHolder?.merchant?.name}
                        </Td>
                        <Td className="text-right">
                          {cardHolder.createdAt &&
                            formatDate(cardHolder.createdAt, {
                              formatType: 'dateAndTime',
                            })}
                        </Td>
                      </Tr>
                    ))}
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
              </div>
            </>
          </div>
        </div>
      </HasPermission>
    </>
  );
};
