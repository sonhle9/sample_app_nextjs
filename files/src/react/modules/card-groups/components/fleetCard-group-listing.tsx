import _ from 'lodash';
import {
  Button,
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  formatDate,
  PaginationNavigation,
  PlusIcon,
  Filter,
  FilterControls,
  DataTableCaption,
  Card,
} from '@setel/portal-ui';
import * as React from 'react';
import {useGetCardGroupsFilterBy, useGetMerchantsFilterBy} from '../card-group.queries';
import CardGroupModal from './card-group-modal';
import {useQueryParams} from 'src/react/routing/routing.context';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getCardGroups} from '../card-group.service';
import {HasPermission} from '../../auth/HasPermission';
import {cardGroupRole} from 'src/shared/helpers/roles.type';
import {CardGroupType} from '../card-group.type';
import {environment} from 'src/environments/environment';
interface ICardGroupProps {
  cardGroupType?: string;
  iActive?: boolean;
}
interface FilterValue {
  search: string;
  merchantId: string;
  dateRange: [string, string];
  cardType: string;
}

export const FleetCardGroupListing = () => {
  const activated = useQueryParams();

  return activated ? <FleetCardGroupList /> : null;
};

export const FleetCardGroupList = (props: ICardGroupProps) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [searchString, setSearchString] = React.useState('');
  const [searchCardGroup, setSearchCardGroup] = React.useState('');
  const {data: merchantList} = useGetMerchantsFilterBy({name: searchString});
  const {data: cardGroupList} = useGetCardGroupsFilterBy({search: searchCardGroup});
  const initialFilter: FilterValue = {
    search: '',
    merchantId: '',
    dateRange: ['', ''],
    cardType: CardGroupType.FLEET,
  };

  const computeFilterValues = ({
    dateRange: [dateFrom, dateTo],
    search,
    merchantId,
    cardType,
    ...filter
  }: FilterValue & {page: number; perPage: number}) => {
    return {
      ...filter,
      search,
      cardType,
      merchantId,
      dateFrom,
      dateTo,
    };
  };
  React.useEffect(() => {
    if (!props.iActive) {
      filter[1].setValue('search', '');
      filter[1].setValue('merchantId', '');
      filter[1].setValue('dateRange', ['', '']);
    }
  }, [props.iActive, props.cardGroupType]);
  const {
    query: {data: data, isFetching},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'cardGroups',
    queryFn: (currentValues) => getCardGroups(computeFilterValues(currentValues)),
    components: () => [
      {
        type: 'searchableselect',
        key: 'merchantId',
        props: {
          label: 'Merchant',
          options:
            merchantList &&
            (merchantList as any).map((merchant) => ({
              value: merchant?.value,
              description: `Merchant ID: ${merchant?.value}`,
              label: merchant?.label,
            })),
          onInputValueChange: setSearchString,
          placeholder: 'All merchants',
        },
      },
      {
        type: 'searchableselect',
        key: 'search',
        props: {
          label: 'Card groups',
          options: cardGroupList,
          onInputValueChange: setSearchCardGroup,
          placeholder: 'All card groups',
          wrapperClass: 'lg:col-span-1',
        },
      },
      {
        type: 'daterange',
        key: 'dateRange',
        props: {
          label: 'Created on',
          wrapperClass: 'lg:col-span-2 xl:col-span-2',
        },
      },
    ],
  });
  return (
    <>
      <HasPermission accessWith={[cardGroupRole.view]}>
        <div className="grid pt-8 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <Card
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}>
            <div className="px-4 py-4 sm:px-7 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap sm:flex-no-wrap">
                <div className="text-xl leading-6 pr-2 py-2 font-medium text-black">
                  Card groups
                </div>
                <div className="flex items-center">
                  <HasPermission accessWith={[cardGroupRole.create]}>
                    <Button
                      variant="primary"
                      leftIcon={<PlusIcon />}
                      className="text-xs"
                      onClick={() => {
                        setVisibleModal(true);
                      }}>
                      CREATE
                    </Button>
                  </HasPermission>
                </div>
              </div>
            </div>
            <HasPermission accessWith={[cardGroupRole.view]}>
              <FilterControls
                filter={filter}
                style={{
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
                className={
                  filter[0].applied.length ? 'grid grid-cols-4 pl-7' : 'grid grid-cols-4 pl-7'
                }
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
                // style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}
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
                    <Td className="w-1/4 pl-7">Merchant</Td>
                    <Td className="w-1/4">card groups</Td>
                    <Td className="w-1/4">description</Td>
                    <Td className="text-right w-1/4 pr-7">Created on</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {(data?.items || []).map((cardGroup, index) => (
                    <Tr
                      onClick={() => {
                        window.open(
                          `${environment.pdbWebDashboardUrl}/card-issuing/card-groups?merchantId=${cardGroup.merchantId}&id=${cardGroup.id}&redirect-from=admin`,
                          '_blank',
                        );
                      }}
                      key={index}>
                      <Td className="break-all truncate max-w-xs w-1/4 pl-7">
                        {cardGroup?.merchant?.name && cardGroup?.merchant?.name}
                      </Td>

                      <Td className="break-all w-1/4">{cardGroup?.name && cardGroup?.name}</Td>
                      <Td className="break-all w-1/4">
                        {cardGroup?.description && cardGroup?.description}
                      </Td>
                      <Td className="text-right w-1/4 pr-7">
                        {cardGroup.createdAt &&
                          formatDate(cardGroup.createdAt, {
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
            </Card>
          </>
          {visibleModal && (
            <CardGroupModal
              visible={visibleModal}
              onClose={() => {
                setVisibleModal(false);
              }}
            />
          )}
        </div>
      </HasPermission>
    </>
  );
};
