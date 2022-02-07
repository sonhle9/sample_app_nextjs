import * as React from 'react';
import {
  Button,
  DataTable,
  DataTableRowGroup,
  DataTableRow as Tr,
  DataTableCell as Td,
  DownloadIcon,
  PlusIcon,
  Badge,
  DataTableCaption,
  PaginationNavigation,
} from '@setel/portal-ui';
import {Link} from '../../../routing/link';
import {salesTerritoryQueryKey} from '../sales-territories.queries';
import {useDataTableState} from '../../../hooks/use-state-with-query-params';
import {getSalesTerritoriesPaginated} from '../sales-territories.service';
import {SalesTerritoryModal} from './sales-territories-modal';
import {SalesTerritoryImportModal} from './sales-territories-import-modal';
import {useNotification} from '../../../hooks/use-notification';
import {SalesTerritoryModalMessage} from '../sales-territories.type';

interface SalesTerritoryListingProps {
  merchantTypeId: string;
}

export const SalesTerritoryListing = (props: SalesTerritoryListingProps) => {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const setNotify = useNotification();

  const {pagination, query} = useDataTableState({
    initialFilter: {},
    queryKey: [salesTerritoryQueryKey.salesTerritoryList, {merchantTypeId: props.merchantTypeId}],
    queryFn: (filter) =>
      getSalesTerritoriesPaginated({
        ...filter,
        merchantTypeId: props.merchantTypeId,
        sortBy: 'name',
      }),
  });

  const renderTerritoryStatus = (inUse: boolean) => {
    return inUse ? (
      <Badge className="uppercase" color="success" rounded="rounded">
        IN USE
      </Badge>
    ) : (
      <Badge className="uppercase" color="error" rounded="rounded">
        NOT IN USE
      </Badge>
    );
  };

  return (
    <div className="grid gap-4 max-w-6xl mx-auto px-4 sm:px-6 my-8">
      <div className="card">
        <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
          <div className="flex items-center">Sales territory</div>
          <div className="inline-flex space-x-3">
            <Button
              leftIcon={<DownloadIcon />}
              variant="outline"
              onClick={() => setShowImportModal(true)}>
              IMPORT
            </Button>
            <Button
              leftIcon={<PlusIcon />}
              variant="primary"
              onClick={() => setShowCreateModal(true)}>
              CREATE
            </Button>
          </div>
        </div>
        {query.data && (
          <div>
            <DataTable
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
                  <Td className="pl-8">Name</Td>
                  <Td>Status</Td>
                  <Td>Code</Td>
                  <Td className="text-right pr-8">Sales person email</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {query.data.items.map((salesTerritory) => (
                  <Tr
                    render={(props) => (
                      <Link
                        {...props}
                        to={`/merchant-types/sales-territory/${salesTerritory.id}`}
                      />
                    )}
                    key={salesTerritory.id}>
                    <Td className="break-all pl-8">{salesTerritory.name}</Td>
                    <Td className="break-all">{renderTerritoryStatus(salesTerritory.inUse)}</Td>
                    <Td className="break-all">{salesTerritory.code}</Td>
                    <Td className="text-right pr-8">{salesTerritory.salesPersonEmail}</Td>
                  </Tr>
                ))}
              </DataTableRowGroup>
              {query.data.isEmpty && (
                <DataTableCaption>
                  <div className="py-6">
                    <p className="text-center text-gray-400 text-sm">No sales territory found</p>
                  </div>
                </DataTableCaption>
              )}
            </DataTable>
          </div>
        )}
      </div>
      {showCreateModal && (
        <SalesTerritoryModal
          merchantTypeId={props.merchantTypeId}
          onClose={(message) => {
            setShowCreateModal(false);
            message === SalesTerritoryModalMessage.EDIT_SUCCESS &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description: 'Sales territory successfully created.',
              });
          }}
        />
      )}
      {showImportModal && (
        <SalesTerritoryImportModal
          onClose={(message) => {
            setShowImportModal(false);
            message === SalesTerritoryModalMessage.IMPORT_SUCCESS &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description: 'Territory merchant linkage CSV successfully imported.',
              });
          }}
        />
      )}
    </div>
  );
};
