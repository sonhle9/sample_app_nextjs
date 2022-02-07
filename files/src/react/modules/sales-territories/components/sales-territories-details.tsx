import {
  Button,
  classes,
  DescList,
  DropdownMenu,
  EditIcon,
  PlusIcon,
  DataTable,
  DataTableRowGroup,
  DataTableRow as Tr,
  DataTableCell as Td,
  Checkbox,
  CheckboxGroup,
  PaginationNavigation,
  formatDate,
} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from '../../../hooks/use-notification';
import {useDataTableState} from '../../../hooks/use-state-with-query-params';
import {downloadFile} from '../../../lib/utils';
import {useRouter} from '../../../routing/routing.context';
import {
  salesTerritoryQueryKey,
  useExportTerritoryMerchants,
  useRemoveTerritoryMerchants,
  useSalesTerritoryDetails,
} from '../sales-territories.queries';
import {getTerritoryMerchantsPaginated} from '../sales-territories.service';
import {SalesTerritoryModalMessage} from '../sales-territories.type';
import {
  SalesTerritoryAddMerchantModal,
  SalesTerritoryTransferMerchantModal,
} from './sales-territories-details.modals';
import {SalesTerritoryModal} from './sales-territories-modal';

interface SalesTerritoryDetailProps {
  id: string;
}

export const SalesTerritoryDetails = (props: SalesTerritoryDetailProps) => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showAddMerchantModal, setShowAddMerchantModal] = React.useState(false);
  const [showTransferMerchantModal, setShowTransferMerchantModal] = React.useState(false);
  const setNotify = useNotification();
  const router = useRouter();

  const {data: salesTerritory, isError: isSalesTerritoryError} = useSalesTerritoryDetails(props.id);

  React.useEffect(() => {
    if (isSalesTerritoryError) {
      router.navigateByUrl(`/merchant-types/${salesTerritory.merchantTypeId}`).then();
      return;
    }
  }, [salesTerritory, isSalesTerritoryError]);

  const {pagination: merchantsPagination, query: merchantsQuery} = useDataTableState({
    initialFilter: {},
    queryKey: [salesTerritoryQueryKey.merchantList, {salesTerritoryId: props.id}],
    queryFn: (filter) =>
      getTerritoryMerchantsPaginated(props.id, {
        ...filter,
        sortBy: 'name',
      }),
  });

  const [merchantCkbValues, setMerchantCkbValues] = React.useState([]);

  const merchantCkbOptions = (merchantsQuery.data?.items || []).map((merchant) => ({
    value: merchant.merchantId,
    label: merchant.name,
    key: merchant.id,
  }));

  const {mutate: removeTerritoryMerchants} = useRemoveTerritoryMerchants(props.id);

  const handleRemoveMerchants = () => {
    removeTerritoryMerchants(merchantCkbValues, {
      onSuccess: () => {
        setMerchantCkbValues([]);
        setNotify({
          title: 'Successful!',
          variant: 'success',
          description: 'Merchants successfully removed.',
        });
      },
      onError: (err) => showErrorNotify(err),
    });
  };

  const {mutate: downloadTerritoryMerchants, isLoading: isDownloading} =
    useExportTerritoryMerchants();

  const handleDownloadCSV = () => {
    downloadTerritoryMerchants(props.id, {
      onSuccess: (csvBlob) => {
        downloadFile(
          csvBlob,
          `territory-merchants-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
        );
        setNotify({
          title: 'Successful!',
          variant: 'success',
          description: 'Merchants CSV successfully downloaded.',
        });
      },
      onError: (err) => showErrorNotify(err),
    });
  };

  const showErrorNotify = (err: any) => {
    const response = err.response && err.response.data;
    setNotify({
      title: 'Failed!',
      variant: 'error',
      description: response?.message || err.message,
    });
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Sales territory details</h1>
        </div>
        <div className="card">
          <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
            <div className="flex items-center">{salesTerritory?.name}</div>
            <Button
              leftIcon={<EditIcon />}
              variant="outline"
              onClick={() => setShowEditModal(true)}>
              EDIT
            </Button>
          </div>
          <div className="px-8 py-5">
            <DescList>
              <DescList.Item label="Name" value={salesTerritory?.name} />
              <DescList.Item label="Code" value={salesTerritory?.code} />
              <DescList.Item label="Sales person email" value={salesTerritory?.salesPersonEmail} />
            </DescList>
          </div>
        </div>
      </div>

      <div className="grid gap-4 my-8 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="card">
          <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
            <div className="flex items-center">Merchants</div>
            {merchantCkbOptions.length > 0 && (
              <div className="inline-flex space-x-3">
                <Button
                  leftIcon={<PlusIcon />}
                  variant="outline"
                  onClick={() => setShowAddMerchantModal(true)}>
                  ADD MERCHANT
                </Button>
                <DropdownMenu variant="outline" label="ACTIONS">
                  <DropdownMenu.Items>
                    <DropdownMenu.Item
                      onSelect={() => handleRemoveMerchants()}
                      disabled={merchantCkbValues.length === 0}>
                      <span className={!(merchantCkbValues.length === 0) ? 'text-black' : ''}>
                        Remove merchants
                      </span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => setShowTransferMerchantModal(true)}
                      disabled={merchantCkbValues.length > 0}>
                      <span className={!(merchantCkbValues.length > 0) ? 'text-black' : ''}>
                        Transfer merchants
                      </span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={handleDownloadCSV}
                      disabled={merchantCkbValues.length > 0 || isDownloading}>
                      <span
                        className={
                          !(merchantCkbValues.length !== 0) && !isDownloading ? 'text-black' : ''
                        }>
                        Download CSV
                      </span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Items>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div>
            {' '}
            {/* table start here */}
            <DataTable
              isLoading={merchantsQuery.isLoading}
              isFetching={merchantsQuery.isFetching}
              pagination={
                <PaginationNavigation
                  currentPage={merchantsPagination.page}
                  perPage={merchantsPagination.perPage}
                  total={merchantsQuery.data ? merchantsQuery.data.total : 0}
                  onChangePage={merchantsPagination.setPage}
                  onChangePageSize={merchantsPagination.setPerPage}
                />
              }>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td className="pl-8">
                    {merchantCkbOptions.length > 0 ? (
                      <Checkbox
                        label={<div className="text-xs text-lightgrey">MERCHANT NAME</div>}
                        checked={
                          merchantCkbValues.length === merchantCkbOptions.length
                            ? true
                            : merchantCkbValues.length > 0
                            ? 'mixed'
                            : false
                        }
                        onChangeValue={(checkedAll) =>
                          setMerchantCkbValues(
                            checkedAll ? merchantCkbOptions.map((o) => o.value) : [],
                          )
                        }
                      />
                    ) : (
                      <div>{'Merchant name'}</div>
                    )}
                  </Td>
                </Tr>
              </DataTableRowGroup>
              {merchantCkbOptions.length > 0 ? (
                <DataTableRowGroup>
                  <CheckboxGroup
                    name="merchantCkb"
                    value={merchantCkbValues}
                    onChangeValue={setMerchantCkbValues}>
                    {merchantCkbOptions.map((option) => (
                      <Tr key={option.value}>
                        <Td className="pl-8">
                          <Checkbox label={option.label} value={option.value} />
                        </Td>
                      </Tr>
                    ))}
                  </CheckboxGroup>
                </DataTableRowGroup>
              ) : (
                <div className="flex content-center flex-col items-center my-10">
                  <p>You have no merchants to be displayed here</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    leftIcon={<PlusIcon />}
                    onClick={() => setShowAddMerchantModal(true)}>
                    ASSIGN MERCHANTS
                  </Button>
                </div>
              )}
            </DataTable>
          </div>{' '}
          {/* to here */}
        </div>
      </div>

      {showEditModal && (
        <SalesTerritoryModal
          onClose={(message, err) => {
            setShowEditModal(false);
            [
              SalesTerritoryModalMessage.EDIT_SUCCESS,
              SalesTerritoryModalMessage.DELETE_SUCCESS,
            ].includes(message) &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description:
                  message === SalesTerritoryModalMessage.EDIT_SUCCESS
                    ? 'Sales territory successfully updated.'
                    : 'Sales territory successfully deleted.',
              });
            SalesTerritoryModalMessage.DELETE_ERROR && !!err && showErrorNotify(err);
          }}
          salesTerritory={salesTerritory}
        />
      )}
      {showAddMerchantModal && (
        <SalesTerritoryAddMerchantModal
          salesTerritoryId={props.id}
          merchantTypeId={salesTerritory?.merchantTypeId}
          onClose={(message) => {
            setShowAddMerchantModal(false);
            message === SalesTerritoryModalMessage.ADD_SUCCESS &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description: 'Merchants successfully added.',
              });
          }}
        />
      )}
      {showTransferMerchantModal && (
        <SalesTerritoryTransferMerchantModal
          salesTerritoryId={props.id}
          merchantTypeId={salesTerritory?.merchantTypeId}
          onClose={(message) => {
            setShowTransferMerchantModal(false);
            message === SalesTerritoryModalMessage.TRANSFER_SUCCESS &&
              setNotify({
                title: 'Successful!',
                variant: 'success',
                description: 'Merchants successfully transferred.',
              });
          }}
        />
      )}
    </>
  );
};
