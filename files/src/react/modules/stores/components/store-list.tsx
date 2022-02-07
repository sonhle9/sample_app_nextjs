import * as React from 'react';
import {PageContainer} from '../../../components/page-container';
import {
  Badge,
  Button,
  Card,
  CardContent,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DropdownSelect,
  FieldContainer,
  PaginationNavigation,
  SearchableDropdownField,
  SearchTextInput,
  usePaginationState,
  PlusIcon,
} from '@setel/portal-ui';
import {format} from 'date-fns';
import _startCase from 'lodash/startCase';
import {StoreCreate} from './store-create';
import {useStores} from '../stores.queries';
import {getStoreStatusColor, useUserCanCreateStore} from '../stores.helpers';
import {IStore, StoresStatusesEnum} from '../stores.types';
import {Link} from '../../../routing/link';
import {IPaginationResult} from '../../../lib/ajax';
import {useRouter} from 'src/react/routing/routing.context';

function StoreNameTd(props: {name: string; id: string}) {
  return (
    <Td>
      <Link to={`/stores/${props.id}`}>{props.name}</Link>
    </Td>
  );
}

function StoreStatusTd(props: {status: StoresStatusesEnum}) {
  return (
    <Td>
      <Badge
        size="large"
        rounded="rounded"
        color={getStoreStatusColor(props.status)}
        className="uppercase tracking-wider">
        {_startCase(props.status)}
      </Badge>
    </Td>
  );
}

function StationNameTd(props: {name: string; id: string}) {
  return (
    <Td>
      <Link to={`/stations/${props.id}/details`}>{props.name}</Link>
    </Td>
  );
}

function StationCreatedAtTd(props: {createdAt: Date}) {
  return (
    <Td className="text-right">{props.createdAt && format(props.createdAt, 'dd MMM yyyy, p')}</Td>
  );
}

const StoreListTable = ({
  pagination,
  stores,
  isLoading,
  isSuccess,
}: {
  pagination: {
    page: number;
    perPage: number;
    setPage: (page: number) => void;
    setPerPage: (pageSize: number) => void;
  };
  stores: IPaginationResult<IStore>;
  isLoading: boolean;
  isSuccess: boolean;
}) => {
  return (
    <Card>
      <div className="overflow-x-auto" data-testid="store-list">
        <Table type="secondary" isLoading={isLoading}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Store Name</Td>
              <Td>Status</Td>
              <Td>Station Name</Td>
              <Td className="text-right">Created On</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup groupType="tbody">
            {stores?.items?.map((store) => (
              <Tr key={store.id}>
                <StoreNameTd name={store.name} id={store.id} />
                <StoreStatusTd status={store.status} />
                <StationNameTd name={store.stationName} id={store.stationId} />
                <StationCreatedAtTd createdAt={store.createdAt && new Date(store.createdAt)} />
              </Tr>
            ))}
          </DataTableRowGroup>
        </Table>
        {!!stores?.items?.length && (
          <PaginationNavigation
            className="p-4"
            total={stores?.total}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
          />
        )}
        {isSuccess && !stores?.items?.length && (
          <div className="h-64 w-full flex items-center justify-center text-lightgrey">
            <span>No result</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export function StoreList() {
  const [status, setStatus] = React.useState<string>();
  // const [query, setQuery] = React.useState<string>('');
  const [queryStore, setQueryStore] = React.useState<string>('');
  const [queryStation, setQueryStation] = React.useState<string>('');
  const [isStoreModalVisible, setIsStoreModalVisible] = React.useState(false);
  const router = useRouter();
  const statusOptions = [
    {
      label: 'All',
      value: '',
    },
    ...Object.values(StoresStatusesEnum).map((value) => ({
      label: _startCase(value),
      value,
    })),
  ];
  const {data: storeSelect} = useStores();
  const storeOptions = storeSelect?.items?.map((store) => ({
    label: store.name,
    value: store.name || store.id,
    description: store.id,
  }));
  const pagination = usePaginationState();
  const {
    data: stores,
    isLoading,
    isSuccess,
    refetch,
  } = useStores(
    {perPage: pagination.perPage, page: pagination.page},
    {status, queryStore, queryStation},
  );
  const canCreate = useUserCanCreateStore();

  return (
    <PageContainer
      heading={'Stores'}
      action={
        canCreate && (
          <>
            <Button
              variant="primary"
              disabled={isLoading}
              leftIcon={<PlusIcon />}
              onClick={() => setIsStoreModalVisible(true)}>
              CREATE
            </Button>
            {isStoreModalVisible && (
              <StoreCreate
                onSuccess={(store: IStore) => {
                  refetch();
                  router.navigateByUrl(`stores/${store.id}/details`);
                }}
                onDismiss={() => setIsStoreModalVisible(false)}
              />
            )}
          </>
        )
      }>
      <Card className="mb-4">
        <CardContent>
          <div className="flex items-center space-x-3 w-100">
            <FieldContainer label={'Status'} className="w-1/2">
              <DropdownSelect<string>
                value={status}
                onChangeValue={setStatus}
                options={statusOptions}
                placeholder="Select status"
                data-testid="status-filter"
              />
            </FieldContainer>
            <FieldContainer label="Search" className="w-1/2">
              <SearchTextInput
                value={queryStation}
                onChangeValue={setQueryStation}
                placeholder="Enter station name or station ID"
              />
            </FieldContainer>
          </div>
          <div className="flex items-center space-x-3 w-100">
            <SearchableDropdownField
              wrapperClass="w-1/2"
              placeholder="All Store"
              label={'Store'}
              value={queryStore}
              onChangeValue={setQueryStore}
              options={storeOptions}
            />
          </div>
        </CardContent>
      </Card>
      <StoreListTable
        stores={stores}
        pagination={pagination}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
    </PageContainer>
  );
}
