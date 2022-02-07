import {
  Badge,
  BareButton,
  Button,
  Card,
  CardHeading,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DropdownMenu,
  ExpandMoreIcon,
  Filter,
  FilterControls,
  Modal,
  ModalHeader,
  PaginationNavigation,
  PlusIcon,
  positionRight,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useNotification} from 'src/react/hooks/use-notification';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {copyText} from 'src/react/lib/copy';
import {Link} from 'src/react/routing/link';
import {indexStations} from 'src/react/services/api-stations.service';
import {IIndexStation} from 'src/shared/interfaces/station.interface';
import {
  StationStatusColor,
  statusLabelMap,
  statusOptions,
  vendorStatusColor,
  vendorStatusOptions,
} from '../stations.const';
import {stationQueryKey, useDownloadStations} from '../stations.queries';
import {StationAddForm} from './station-add-form';
import {StationEditInfoForm} from './station-edit-info-form';
import {StationMapView} from './station-map-view';
import {StationPosSystemStatus} from './station-pos-system-status';

export const StationListing = () => {
  const {
    pagination,
    filter,
    query: {data, isLoading, isFetching},
  } = useDataTableState({
    queryKey: stationQueryKey.indexStations,
    initialFilter: {
      status: '',
      name: '',
      vendorStatus: '',
    },
    queryFn: (params) => indexStations(params),
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          placeholder: 'Any statuses',
          options: statusOptions,
        },
      },
      {
        key: 'vendorStatus',
        type: 'select',
        props: {
          label: 'Vendor Status',
          placeholder: 'Any vendor statuses',
          options: vendorStatusOptions,
        },
      },
      {
        key: 'name',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Search by Station ID, Station name, or Station address',
          wrapperClass: 'xl:col-span-2',
        },
      },
    ],
  });

  const [showAddForm, setShowAddForm] = React.useState(false);
  const [stationToEdit, setStationToEdit] = React.useState<IIndexStation | undefined>(undefined);
  const [format, setFormat] = React.useState<'list' | 'map'>('list');
  const showMessage = useNotification();

  const {mutate: download} = useDownloadStations();

  const contentHeader = (
    <CardHeading title={format === 'list' ? 'List' : 'Map'}>
      <div className="inline-block">
        <Button
          onClick={() => setFormat('list')}
          variant={format === 'list' ? 'primary' : 'outline'}
          className="sm:leading-none rounded-l-md rounded-r-none border border-brand-500">
          LIST
        </Button>
        <Button
          onClick={() => setFormat('map')}
          variant={format === 'map' ? 'primary' : 'outline'}
          className="sm:leading-none rounded-r-md rounded-l-none border border-brand-500">
          MAP
        </Button>
      </div>
    </CardHeading>
  );

  const [{values}] = filter;

  return (
    <PageContainer
      heading="Station"
      action={
        <div className="space-x-3">
          <DropdownMenu
            label="MORE"
            leftIcon={<ExpandMoreIcon />}
            variant="outline"
            rightIcon={null}>
            <DropdownMenu.Items getPosition={positionRight}>
              <DropdownMenu.Item onSelect={() => download(values)}>Download CSV</DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() =>
                  copyText(window.location.href).then(() =>
                    showMessage({
                      title: 'URL copied.',
                    }),
                  )
                }>
                Copy URL
              </DropdownMenu.Item>
            </DropdownMenu.Items>
          </DropdownMenu>
          <Button onClick={() => setShowAddForm(true)} variant="primary" leftIcon={<PlusIcon />}>
            ADD STATION
          </Button>
        </div>
      }>
      <Modal
        isOpen={!!stationToEdit}
        aria-label="Edit station"
        onDismiss={() => setStationToEdit(undefined)}>
        <ModalHeader>Edit station</ModalHeader>
        {stationToEdit && (
          <StationEditInfoForm
            current={stationToEdit}
            onDismiss={() => setStationToEdit(undefined)}
          />
        )}
      </Modal>
      <Modal isOpen={showAddForm} aria-label="Add station" onDismiss={() => setShowAddForm(false)}>
        <ModalHeader>Add station</ModalHeader>
        {showAddForm && <StationAddForm onDismiss={() => setShowAddForm(false)} />}
      </Modal>
      <div className="space-y-5">
        <StationPosSystemStatus />
        <FilterControls filter={filter} />
        <Filter filter={filter} />
        {format === 'list' ? (
          <DataTable
            isLoading={isLoading}
            isFetching={isFetching}
            heading={contentHeader}
            pagination={
              <PaginationNavigation
                total={data && data.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Station name</Td>
                <Td>Status</Td>
                <Td>Vendor status</Td>
                <Td>Vendor type</Td>
                <Td className="text-right">Action</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {data &&
                data.items.map((station) => (
                  <Tr key={station.id}>
                    <Td>
                      <Link to={`/stations/${station.id}/details`} className="focus-visible-ring">
                        {station.name}
                      </Link>
                    </Td>
                    <Td>
                      {station.status && (
                        <Badge color={StationStatusColor[station.status]} className="uppercase">
                          {statusLabelMap[station.status]}
                        </Badge>
                      )}
                    </Td>
                    <Td>
                      {station.healthCheck ? (
                        <Badge
                          color={vendorStatusColor[station.healthCheck.status]}
                          className="uppercase">
                          {station.healthCheck.status}
                        </Badge>
                      ) : (
                        <Badge>UNKNOWN</Badge>
                      )}
                    </Td>
                    <Td className="capitalize">{station.vendorType}</Td>
                    <Td className="text-right">
                      <BareButton
                        onClick={() => setStationToEdit(station)}
                        className="text-brand-500">
                        EDIT
                      </BareButton>
                    </Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
          </DataTable>
        ) : (
          <Card>
            {contentHeader}
            <StationMapView
              filter={{
                status: values.status,
                vendorStatus: values.vendorStatus,
                name: values.name,
              }}
            />
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
