import {
  Button,
  classes,
  DataTable,
  DataTableCaption,
  DataTableRowGroup,
  FilterControls,
  formatDate,
  PaginationNavigation,
  PlusIcon,
} from '@setel/portal-ui';
import {DataTableRow as Tr} from '@setel/portal-ui';
import {DataTableCell as Td} from '@setel/portal-ui';
import {Link} from '../../../routing/link';
import * as React from 'react';
import {MerchantTypesDetailModal} from './merchant-types-detail-modal';
import {useDataTableState} from '../../../hooks/use-state-with-query-params';
import {merchantQueryKey} from '../../merchants/merchants.queries';
import {getMerchantTypesPaginated} from '../merchant-types.service';

export const MerchantTypeListing = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);

  const {pagination, query, filter} = useDataTableState({
    initialFilter: {
      searchValue: '',
    },
    queryKey: merchantQueryKey.merchantType,
    queryFn: (filterValue) =>
      getMerchantTypesPaginated({
        ...filterValue,
        searchValue: filterValue.searchValue.trim() ? filterValue.searchValue.trim() : undefined,
      }),
    components: [
      {
        key: 'searchValue',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Search merchant types',
          wrapperClass: 'xl:col-span-2',
        },
      },
    ],
  });

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6  pb-12">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Merchant types</h1>
          <Button leftIcon={<PlusIcon />} variant="primary" onClick={() => setVisibleModal(true)}>
            CREATE
          </Button>
        </div>
        {query.data && (
          <>
            <div>
              <FilterControls filter={filter} className={'mb-5'} />
              <DataTable
                striped
                isLoading={query.isLoading}
                isFetching={query.isFetching}
                pagination={
                  <PaginationNavigation
                    currentPage={pagination.page}
                    perPage={pagination.perPage}
                    total={query.data ? query.data.total : 0}
                    onChangePage={pagination.setPage}
                    onChangePageSize={pagination.setPerPage}
                  />
                }>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td>Name</Td>
                    <Td>Code</Td>
                    <Td className="text-right">Created On</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {query.data.items.map((merchantType) => (
                    <Tr
                      render={(props) => (
                        <Link {...props} to={`/merchant-types/${merchantType.id}`} />
                      )}
                      key={merchantType.id}>
                      <Td className="break-all">{merchantType.name}</Td>
                      <Td className="break-all">{merchantType.code}</Td>
                      <Td className="text-right">
                        {formatDate(merchantType.createdAt, {
                          formatType: 'dateAndTime',
                        })}
                      </Td>
                    </Tr>
                  ))}
                </DataTableRowGroup>
                {query.data.isEmpty && (
                  <DataTableCaption>
                    <div className="py-6">
                      <p className="text-center text-gray-400 text-sm">No merchant type found</p>
                    </div>
                  </DataTableCaption>
                )}
              </DataTable>
            </div>
          </>
        )}
      </div>
      {visibleModal && (
        <MerchantTypesDetailModal
          onClose={() => {
            setVisibleModal(false);
          }}
        />
      )}
    </>
  );
};
