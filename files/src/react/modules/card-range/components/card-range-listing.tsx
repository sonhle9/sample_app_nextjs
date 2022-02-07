import _ from 'lodash';
import {
  Button,
  classes,
  FilterControls,
  Filter,
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  PaginationNavigation,
  DataTableCaption,
  PlusIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {useQueryParams} from 'src/react/routing/routing.context';
import {getCardRanges} from '../card-range.service';
import {FilterByMap} from '../card-range.type';
import {Link} from 'src/react/routing/link';
import CardRangeModal from './card-range-modal';
import {cardRangeRole} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {EType} from 'src/shared/enums/card.enum';

interface FilterValue {
  type: EType;
  search: string;
  dateRange: [string, string];
}

const initialFilter: FilterValue = {
  type: null,
  search: '',
  dateRange: ['', ''],
};

const computeFilterValues = ({
  dateRange: [dateFrom, dateTo],
  type,
  search,
  ...filter
}: FilterValue & {page: number; perPage: number}) => {
  return {
    ...filter,
    type,
    search,
    dateFrom,
    dateTo,
  };
};

export const CardRangeListing = () => {
  const activated = useQueryParams();

  return activated ? <CardRangeList /> : null;
};

export const CardRangeList = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);

  const {
    query: {data: data, isFetching},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter,
    queryKey: 'cardRanges',
    queryFn: (currentValues) => getCardRanges(computeFilterValues(currentValues)),
    components: () => [
      {
        type: 'select',
        key: 'type',
        props: {
          label: 'Type',
          options: FilterByMap,
          placeholder: 'All',
          wrapperClass: 'col-start-1',
        },
      },
      {
        type: 'search',
        key: 'search',
        props: {
          placeholder: 'Search card range or start number…',
          label: 'Search',
          wrapperClass: 'sm:col-span-3',
          disabled: false,
        },
      },
    ],
  });

  return (
    <>
      <HasPermission accessWith={[cardRangeRole.view]}>
        <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Card ranges</h1>
            <div>
              <HasPermission accessWith={[cardRangeRole.create]}>
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
          <HasPermission accessWith={[cardRangeRole.view]}>
            <FilterControls
              filter={filter}
              className={filter[0].applied.length ? 'grid grid-cols-6' : 'grid grid-cols-6 mb-4'}
            />
            <Filter filter={filter} />
          </HasPermission>
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
                    <Td>Card Range</Td>
                    <Td>Start Number</Td>
                    <Td>Current Number</Td>
                    <Td>End Number</Td>
                    <Td className="text-right">Total cards</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {(data?.items || []).map((cardRange, index) => (
                    <Tr
                      render={(props) => (
                        <Link {...props} to={`/card-issuing/card-ranges/${cardRange.id}`} />
                      )}
                      key={index}>
                      <Td>{cardRange.name}</Td>
                      <Td className="break-all">{cardRange.startNumber}</Td>
                      <Td className="break-all">
                        {cardRange.currentNumber ? cardRange.currentNumber : ''}
                      </Td>
                      <Td className="break-all">{cardRange.endNumber}</Td>
                      <Td className="text-right">
                        {parseInt(cardRange.endNumber, 10) > 0
                          ? parseInt(cardRange.endNumber, 10) - parseInt(cardRange.startNumber, 10)
                          : 0}
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
          {visibleModal && (
            <CardRangeModal
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
