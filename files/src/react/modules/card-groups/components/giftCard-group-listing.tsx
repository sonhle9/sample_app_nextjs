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
import {useGetCardGroupsFilterBy} from '../card-group.queries';
import CardGroupModal from './card-group-modal';
import {useQueryParams} from 'src/react/routing/routing.context';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getCardGroups} from '../card-group.service';
import {Link} from 'src/react/routing/link';
import {HasPermission} from '../../auth/HasPermission';
import {cardGroupRole} from 'src/shared/helpers/roles.type';
import {CardGroupType} from '../card-group.type';
interface ICardGroupProps {
  cardGroupType?: string;
  iActive?: boolean;
}
interface FilterValue {
  search: string;
  dateRange: [string, string];
  cardType: string;
}

export const GiftCardGroupListing = () => {
  const activated = useQueryParams();
  return activated ? <GiftCardGroupList /> : null;
};

export const GiftCardGroupList = (props: ICardGroupProps) => {
  const initialFilter: FilterValue = {
    search: '',
    dateRange: ['', ''],
    cardType:
      props?.cardGroupType === CardGroupType.GIFT ? CardGroupType.GIFT : CardGroupType.LOYALTY,
  };

  const computeFilterValues = ({
    dateRange: [dateFrom, dateTo],
    search,
    cardType,
    ...filter
  }: FilterValue & {page: number; perPage: number}) => {
    return {
      ...filter,
      search,
      cardType,
      dateFrom,
      dateTo,
    };
  };
  React.useEffect(() => {
    if (!props?.iActive) {
      filter[1].setValue('search', '');
      filter[1].setValue('dateRange', ['', '']);
    }
  }, [props.iActive, props.cardGroupType]);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [searchCardGroup, setSearchCardGroup] = React.useState('');
  const {data: cardGroupList} = useGetCardGroupsFilterBy({search: searchCardGroup});
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
        key: 'search',
        props: {
          label: 'Card groups',
          options: cardGroupList,
          onInputValueChange: setSearchCardGroup,
          placeholder: 'All card groups',
        },
      },
      {
        type: 'daterange',
        key: 'dateRange',
        props: {
          label: 'Created on',
          wrapperClass: 'col-span-2',
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
                    <Td className="w-1/3 pl-7">Card groups</Td>
                    <Td className="w-1/3 pl-28">description</Td>
                    <Td className="text-right w-1/3 pr-7">Created on</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {(data?.items || []).map((cardGroup, index) => (
                    <Tr
                      render={(props) => (
                        <Link {...props} to={`/card-issuing/card-groups/${cardGroup.id}`} />
                      )}
                      key={index}>
                      <Td className="break-all capitalize pl-7">
                        {cardGroup.name && cardGroup.name}
                      </Td>

                      <Td className="break-all truncate max-w-xs pl-28">
                        {cardGroup?.description}
                      </Td>
                      <Td className="text-right pr-7">
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
